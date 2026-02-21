import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const emptyProject = {
  name: "", slug: "", location: "", price: "", description: "", short_description: "",
  image_url: "", type: "", status: "draft", area: "", rera_number: "", amenities: [] as string[], gallery: [] as string[],
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [amenitiesStr, setAmenitiesStr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setProjects(data ?? []);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyProject); setAmenitiesStr(""); setOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ name: p.name, slug: p.slug, location: p.location, price: p.price, description: p.description, short_description: p.short_description, image_url: p.image_url, type: p.type, status: p.status, area: p.area, rera_number: p.rera_number, amenities: p.amenities ?? [], gallery: p.gallery ?? [] });
    setAmenitiesStr((p.amenities ?? []).join(", "));
    setOpen(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(fileName, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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

  const removeGalleryImage = (index: number) => {
    setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    const payload = { ...form, amenities: amenitiesStr.split(",").map(s => s.trim()).filter(Boolean), slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") };
    if (editing) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Project updated" });
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Project created" });
    }
    setOpen(false);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
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
                <Label>Main Image</Label>
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
              <div className="space-y-2"><Label>Amenities (comma-separated)</Label><Input value={amenitiesStr} onChange={e => setAmenitiesStr(e.target.value)} /></div>

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
