import { useEffect, useState, useRef } from "react";
import { neon } from "@/lib/neon";
import { uploadToCloudinary, uploadFileToCloudinary } from "@/lib/cloudinary";
// Lazy-loaded to avoid bundling pdf.js + jsPDF for all users
const loadCompressor = () => import("@/lib/compress-pdf").then(m => m.compressPdf);
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, X, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Project } from "@/lib/db-types";
import { AMENITY_NAMES, getAmenityIcon } from "@/data/amenities";

const emptyProject = {
  name: "", slug: "", location: "", price: "", description: "", short_description: "",
  image_url: "", type: "", status: "draft", area: "", rera_number: "", brochure_url: "", amenities: [] as string[], gallery: [] as string[],
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [amenitiesStr, setAmenitiesStr] = useState("");
  const [amenityInput, setAmenityInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const amenityInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);

  const fetchProjects = async () => {
    const { data } = await neon.from("projects").select("*").order("created_at", { ascending: false });
    setProjects(data ?? []);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyProject); setAmenitiesStr(""); setOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ name: p.name, slug: p.slug, location: p.location, price: p.price, description: p.description, short_description: p.short_description, image_url: p.image_url, type: p.type, status: p.status, area: p.area, rera_number: p.rera_number, brochure_url: p.brochure_url ?? "", amenities: p.amenities ?? [], gallery: p.gallery ?? [] });
    setAmenitiesStr((p.amenities ?? []).join(", "));
    setOpen(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const url = await uploadToCloudinary(file, "project-images");
    if (!url) {
      toast({ title: "Upload failed", description: "Could not upload image", variant: "destructive" });
    }
    return url;
  };

  const validateImageDimensions = (file: File, minWidth = 1200, minRatio = 1.2): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        if (img.width < minWidth) {
          toast({ title: "Image too small", description: `Minimum width is ${minWidth}px. Uploaded image is ${img.width}px wide.`, variant: "destructive" });
          resolve(false);
        } else if (ratio < minRatio) {
          toast({ title: "Image must be landscape", description: `Use a landscape image (at least ${minRatio}:1 ratio). Uploaded image ratio is ${ratio.toFixed(2)}:1.`, variant: "destructive" });
          resolve(false);
        } else {
          resolve(true);
        }
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => { resolve(false); URL.revokeObjectURL(img.src); };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const valid = await validateImageDimensions(file);
    if (!valid) { e.target.value = ""; return; }
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setForm(f => ({ ...f, image_url: url }));
    setUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }
    setForm(f => ({ ...f, gallery: [...f.gallery, ...urls] }));
    setUploadingGallery(false);
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF file", variant: "destructive" });
      e.target.value = "";
      return;
    }
    setUploadingBrochure(true);
    try {
      let processedFile = file;
      const maxSize = 10 * 1024 * 1024; // 10 MB
      if (file.size > maxSize) {
        toast({ title: "Compressing PDF", description: `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Compressing to fit under 10 MB...` });
        const compressPdf = await loadCompressor();
        processedFile = await compressPdf(file, maxSize);
        const savedPct = ((1 - processedFile.size / file.size) * 100).toFixed(0);
        toast({ title: "Compression done", description: `Reduced from ${(file.size / 1024 / 1024).toFixed(1)} MB to ${(processedFile.size / 1024 / 1024).toFixed(1)} MB (${savedPct}% smaller)` });
      }
      const url = await uploadFileToCloudinary(processedFile, "project-brochures");
      if (url) {
        setForm(f => ({ ...f, brochure_url: url }));
        toast({ title: "Brochure uploaded" });
      } else {
        toast({ title: "Upload failed", description: "Could not upload brochure", variant: "destructive" });
      }
    } catch (err) {
      console.error("Brochure processing error:", err);
      toast({ title: "Error", description: "Failed to process brochure. Try a smaller file.", variant: "destructive" });
    }
    setUploadingBrochure(false);
    e.target.value = "";
  };

  const removeGalleryImage = (index: number) => {
    setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    const payload = { ...form, amenities: amenitiesStr.split(",").map(s => s.trim()).filter(Boolean), slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") };
    if (editing) {
      const { error } = await neon.from("projects").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Project updated" });
    } else {
      const { error } = await neon.from("projects").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Project created" });
    }
    setOpen(false);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await neon.from("projects").delete().eq("id", id);
    toast({ title: "Project deleted" });
    fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold">Projects</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gold-gradient text-primary-foreground" onClick={openNew}><Plus className="w-4 h-4 mr-2" />Add Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name <span className="text-muted-foreground text-xs">({form.name.length}/60)</span></Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value.slice(0, 60)}))} maxLength={60} /></div>
                <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} placeholder="auto-generated" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} /></div>
                <div className="space-y-2"><Label>Price</Label><Input value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Type</Label><Input value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} /></div>
                <div className="space-y-2"><Label>Area</Label><Input value={form.area} onChange={e => setForm(f => ({...f, area: e.target.value}))} /></div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2"><Label>RERA Number</Label><Input value={form.rera_number} onChange={e => setForm(f => ({...f, rera_number: e.target.value}))} placeholder="e.g. RAJ/P/2019/942" /></div>

              {/* Main Image Upload */}
              <div className="space-y-2">
                <Label>Main Image <span className="text-muted-foreground text-xs">(Recommended: 1920×1080, landscape)</span></Label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors text-sm">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} disabled={uploading} />
                  </label>
                  <span className="text-xs text-muted-foreground">or</span>
                  <Input value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} placeholder="Paste image URL" className="flex-1" />
                </div>
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="w-32 h-24 object-cover rounded border border-border mt-2" />
                )}
              </div>

              <div className="space-y-2"><Label>Short Description <span className="text-muted-foreground text-xs">({form.short_description.length}/150)</span></Label><Textarea value={form.short_description} onChange={e => setForm(f => ({...f, short_description: e.target.value.slice(0, 150)}))} rows={2} maxLength={150} /></div>
              <div className="space-y-2"><Label>Full Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={4} /></div>
              {/* Amenities with autocomplete */}
              <div className="space-y-2">
                <Label>Amenities</Label>
                {/* Selected amenities as tags */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                  {amenitiesStr.split(",").map(s => s.trim()).filter(Boolean).map((amenity, i) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <span key={i} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full border border-primary/20">
                        <Icon className="w-3 h-3" />
                        {amenity}
                        <button
                          type="button"
                          onClick={() => {
                            const arr = amenitiesStr.split(",").map(s => s.trim()).filter(Boolean);
                            arr.splice(i, 1);
                            setAmenitiesStr(arr.join(", "));
                          }}
                          className="ml-0.5 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
                {/* Autocomplete input */}
                <div className="relative">
                  <Input
                    ref={amenityInputRef}
                    value={amenityInput}
                    onChange={e => { setAmenityInput(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = amenityInput.trim();
                        if (val) {
                          const existing = amenitiesStr.split(",").map(s => s.trim()).filter(Boolean);
                          if (!existing.some(a => a.toLowerCase() === val.toLowerCase())) {
                            setAmenitiesStr([...existing, val].join(", "));
                          }
                          setAmenityInput("");
                          setShowSuggestions(false);
                        }
                      }
                    }}
                    placeholder="Type to search amenities..."
                  />
                  {showSuggestions && amenityInput.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-popover border border-border rounded-md shadow-lg">
                      {AMENITY_NAMES
                        .filter(name => {
                          const existing = amenitiesStr.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
                          return name.toLowerCase().includes(amenityInput.toLowerCase()) && !existing.includes(name.toLowerCase());
                        })
                        .slice(0, 12)
                        .map(name => {
                          const Icon = getAmenityIcon(name);
                          return (
                            <button
                              key={name}
                              type="button"
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent text-left transition-colors"
                              onMouseDown={e => {
                                e.preventDefault();
                                const existing = amenitiesStr.split(",").map(s => s.trim()).filter(Boolean);
                                setAmenitiesStr([...existing, name].join(", "));
                                setAmenityInput("");
                                setShowSuggestions(false);
                                amenityInputRef.current?.focus();
                              }}
                            >
                              <Icon className="w-4 h-4 text-primary" />
                              {name}
                            </button>
                          );
                        })}
                      {AMENITY_NAMES.filter(name => name.toLowerCase().includes(amenityInput.toLowerCase())).length === 0 && (
                        <p className="px-3 py-2 text-xs text-muted-foreground">No match — press Enter to add custom</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Upload */}
              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <label className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors text-sm w-fit">
                  <Upload className="w-4 h-4" />
                  {uploadingGallery ? "Uploading..." : "Upload Gallery Images"}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                </label>
                {form.gallery.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.gallery.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`Gallery ${i + 1}`} className="w-24 h-20 object-cover rounded border border-border" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Brochure Upload */}
              <div className="space-y-2">
                <Label>Brochure (PDF)</Label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors text-sm">
                    <Upload className="w-4 h-4" />
                    {uploadingBrochure ? "Uploading..." : "Upload Brochure"}
                    <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleBrochureUpload} disabled={uploadingBrochure} />
                  </label>
                  {form.brochure_url && (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <a href={form.brochure_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline truncate">
                        <FileText className="w-4 h-4 shrink-0" />
                        Brochure uploaded
                      </a>
                      <button type="button" onClick={() => setForm(f => ({ ...f, brochure_url: "" }))} className="text-destructive hover:text-destructive/80">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleSave} className="gold-gradient text-primary-foreground">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-sans font-medium">Name</th>
            <th className="text-left p-3 font-sans font-medium">Location</th>
            <th className="text-left p-3 font-sans font-medium">Price</th>
            <th className="text-left p-3 font-sans font-medium">Status</th>
            <th className="text-right p-3 font-sans font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-muted-foreground">{p.location}</td>
                <td className="p-3 text-primary font-medium">{p.price}</td>
                <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full ${p.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></td>
                <td className="p-3 text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No projects yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProjects;
