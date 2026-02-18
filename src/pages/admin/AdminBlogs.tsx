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

type Blog = Tables<"blog_posts">;

const emptyBlog = { title: "", slug: "", excerpt: "", content: "", image_url: "", category: "", author: "Admin", status: "draft" };

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState(emptyBlog);

  const fetch = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setBlogs(data ?? []);
  };
  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyBlog); setOpen(true); };
  const openEdit = (b: Blog) => { setEditing(b); setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt, content: b.content, image_url: b.image_url, category: b.category, author: b.author, status: b.status }); setOpen(true); };

  const handleSave = async () => {
    const payload = { ...form, slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""), published_at: form.status === "published" ? new Date().toISOString() : null };
    if (editing) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Blog post updated" });
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Blog post created" });
    }
    setOpen(false); fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Blog post deleted" }); fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold">Blog Posts</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gold-gradient text-primary-foreground" onClick={openNew}><Plus className="w-4 h-4 mr-2" />Add Post</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} /></div>
                <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} placeholder="auto-generated" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} /></div>
                <div className="space-y-2"><Label>Author</Label><Input value={form.author} onChange={e => setForm(f => ({...f, author: e.target.value}))} /></div>
                <div className="space-y-2"><Label>Status</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                    <option value="draft">Draft</option><option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2"><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} /></div>
              <div className="space-y-2"><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} rows={2} /></div>
              <div className="space-y-2"><Label>Content</Label><Textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} rows={8} /></div>
              <Button onClick={handleSave} className="gold-gradient text-primary-foreground">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-sans font-medium">Title</th>
            <th className="text-left p-3 font-sans font-medium">Category</th>
            <th className="text-left p-3 font-sans font-medium">Status</th>
            <th className="text-left p-3 font-sans font-medium">Created</th>
            <th className="text-right p-3 font-sans font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {blogs.map(b => (
              <tr key={b.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{b.title}</td>
                <td className="p-3 text-muted-foreground">{b.category}</td>
                <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full ${b.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{b.status}</span></td>
                <td className="p-3 text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No blog posts yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBlogs;
