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

type Testimonial = Tables<"testimonials">;

const emptyTestimonial = { name: "", role: "", content: "", rating: 5, image_url: "", status: "draft" };

const AdminTestimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyTestimonial);

  const fetch = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyTestimonial); setOpen(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ name: t.name, role: t.role, content: t.content, rating: t.rating, image_url: t.image_url ?? "", status: t.status }); setOpen(true); };

  const handleSave = async () => {
    if (editing) {
      const { error } = await supabase.from("testimonials").update(form).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Testimonial updated" });
    } else {
      const { error } = await supabase.from("testimonials").insert(form);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Testimonial created" });
    }
    setOpen(false); fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    toast({ title: "Testimonial deleted" }); fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold">Testimonials</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gold-gradient text-primary-foreground" onClick={openNew}><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Testimonial" : "New Testimonial"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /></div>
                <div className="space-y-2"><Label>Role / Title</Label><Input value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({...f, rating: Number(e.target.value)}))} /></div>
                <div className="space-y-2"><Label>Status</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                    <option value="draft">Draft</option><option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2"><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} /></div>
              <div className="space-y-2"><Label>Content</Label><Textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} rows={4} /></div>
              <Button onClick={handleSave} className="gold-gradient text-primary-foreground">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-sans font-medium">Name</th>
            <th className="text-left p-3 font-sans font-medium">Role</th>
            <th className="text-left p-3 font-sans font-medium">Rating</th>
            <th className="text-left p-3 font-sans font-medium">Status</th>
            <th className="text-right p-3 font-sans font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{t.name}</td>
                <td className="p-3 text-muted-foreground">{t.role}</td>
                <td className="p-3">{"★".repeat(t.rating)}</td>
                <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full ${t.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{t.status}</span></td>
                <td className="p-3 text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No testimonials yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTestimonials;
