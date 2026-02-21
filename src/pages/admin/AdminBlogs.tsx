import { useEffect, useState, useCallback } from "react";
import { neon } from "@/lib/neon";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Eye, Code, FileText, Image, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { BlogPost } from "@/lib/db-types";
import { marked } from "marked";
import DOMPurify from "dompurify";

type Blog = BlogPost;

const emptyBlog = { title: "", slug: "", excerpt: "", content: "", image_url: "", category: "", author: "Admin", status: "draft" };

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState(emptyBlog);
  const [contentMode, setContentMode] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");

  const fetchBlogs = async () => {
    const { data } = await neon.from("blog_posts").select("*").order("created_at", { ascending: false });
    setBlogs(data ?? []);
  };
  useEffect(() => { fetchBlogs(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyBlog); setContentMode("write"); setGeneratedUrl(""); setOpen(true); };
  const openEdit = (b: Blog) => { setEditing(b); setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt, content: b.content, image_url: b.image_url, category: b.category, author: b.author, status: b.status }); setContentMode("write"); setGeneratedUrl(""); setOpen(true); };

  const uploadImage = async (file: File): Promise<string | null> => {
    const url = await uploadToCloudinary(file, "blog-images");
    if (!url) {
      toast({ title: "Upload failed", description: "Could not upload image", variant: "destructive" });
    }
    return url;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setForm(f => ({ ...f, image_url: url }));
    setUploading(false);
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingInline(true);
    const url = await uploadImage(file);
    if (url) setGeneratedUrl(url);
    setUploadingInline(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    toast({ title: "URL copied!" });
  };

  const insertImageMarkdown = () => {
    if (!generatedUrl) return;
    const md = `\n![Image description](${generatedUrl})\n`;
    setForm(f => ({ ...f, content: f.content + md }));
    toast({ title: "Image markdown inserted into content" });
  };

  const renderPreview = useCallback(() => {
    const raw = marked.parse(form.content, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [form.content]);

  const handleSave = async () => {
    const payload = { ...form, slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""), published_at: form.status === "published" ? new Date().toISOString() : null };
    if (editing) {
      const { error } = await neon.from("blog_posts").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Blog post updated" });
    } else {
      const { error } = await neon.from("blog_posts").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Blog post created" });
    }
    setOpen(false); fetchBlogs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    await neon.from("blog_posts").delete().eq("id", id);
    toast({ title: "Blog post deleted" }); fetchBlogs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold">Blog Posts</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gold-gradient text-primary-foreground" onClick={openNew}><Plus className="w-4 h-4 mr-2" />Add Post</Button></DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
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
                {form.image_url && <img src={form.image_url} alt="Preview" className="w-32 h-24 object-cover rounded border border-border mt-2" />}
              </div>

              <div className="space-y-2"><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} rows={2} /></div>

              {/* Content Editor with Markdown/HTML support */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    Content
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-normal">Supports Markdown & HTML</span>
                  </Label>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant={contentMode === "write" ? "default" : "ghost"} size="sm" onClick={() => setContentMode("write")} className="h-7 text-xs gap-1">
                      <Code className="w-3 h-3" /> Write
                    </Button>
                    <Button type="button" variant={contentMode === "preview" ? "default" : "ghost"} size="sm" onClick={() => setContentMode("preview")} className="h-7 text-xs gap-1">
                      <Eye className="w-3 h-3" /> Preview
                    </Button>
                  </div>
                </div>

                {contentMode === "write" ? (
                  <Textarea
                    value={form.content}
                    onChange={e => setForm(f => ({...f, content: e.target.value}))}
                    rows={16}
                    className="font-mono text-sm"
                    placeholder={"# Blog Title\n\nWrite your blog content here using **Markdown** or <b>HTML</b>.\n\n## Section Heading\n\nParagraph text with *italic* and **bold** formatting.\n\n- List item 1\n- List item 2\n\n![Image alt text](image-url-here)"}
                  />
                ) : (
                  <div className="border border-input rounded-md p-4 min-h-[300px] bg-background prose prose-sm max-w-none
                    [&_h1]:text-2xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mb-4
                    [&_h2]:text-xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-3
                    [&_h3]:text-lg [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2
                    [&_p]:text-foreground [&_p]:leading-relaxed [&_p]:mb-3
                    [&_img]:max-w-full [&_img]:rounded-md [&_img]:my-4
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
                    [&_li]:text-foreground [&_li]:mb-1
                    [&_a]:text-primary [&_a]:underline
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
                    [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                    [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto
                    [&_strong]:font-bold [&_em]:italic"
                    dangerouslySetInnerHTML={{ __html: renderPreview() }}
                  />
                )}
              </div>

              {/* Inline Image Upload for generating URLs */}
              <div className="border border-dashed border-border rounded-md p-4 space-y-3 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-medium">Generate Image URL for Content</Label>
                </div>
                <p className="text-xs text-muted-foreground">Upload an image to get a URL you can use in your markdown/HTML content.</p>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors text-sm bg-background">
                    <Upload className="w-4 h-4" />
                    {uploadingInline ? "Uploading..." : "Upload Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleInlineImageUpload} disabled={uploadingInline} />
                  </label>
                </div>
                {generatedUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input value={generatedUrl} readOnly className="flex-1 text-xs font-mono bg-background" />
                      <Button type="button" variant="outline" size="sm" onClick={copyUrl} className="gap-1">
                        <Copy className="w-3 h-3" /> Copy
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={insertImageMarkdown} className="gap-1">
                        <FileText className="w-3 h-3" /> Insert MD
                      </Button>
                    </div>
                    <img src={generatedUrl} alt="Uploaded" className="w-24 h-20 object-cover rounded border border-border" />
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
