import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const emptyProject = {
  name: "", slug: "", location: "", price: "", description: "", short_description: "",
  image_url: "", type: "", status: "draft", area: "", amenities: [] as string[], gallery: [] as string[],
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [amenitiesStr, setAmenitiesStr] = useState("");

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setProjects(data ?? []);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyProject); setAmenitiesStr(""); setOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ name: p.name, slug: p.slug, location: p.location, price: p.price, description: p.description, short_description: p.short_description, image_url: p.image_url, type: p.type, status: p.status, area: p.area, amenities: p.amenities ?? [], gallery: p.gallery ?? [] });
    setAmenitiesStr((p.amenities ?? []).join(", "));
    setOpen(true);
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
                <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /></div>
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
              <div className="space-y-2"><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} /></div>
              <div className="space-y-2"><Label>Short Description</Label><Textarea value={form.short_description} onChange={e => setForm(f => ({...f, short_description: e.target.value}))} rows={2} /></div>
              <div className="space-y-2"><Label>Full Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={4} /></div>
              <div className="space-y-2"><Label>Amenities (comma-separated)</Label><Input value={amenitiesStr} onChange={e => setAmenitiesStr(e.target.value)} /></div>
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
