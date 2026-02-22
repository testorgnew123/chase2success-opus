import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useBlog } from "@/hooks/useBlogs";
import SEO from "@/components/SEO";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useMemo } from "react";

const BlogDetail = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = useBlog(slug);

  const renderedContent = useMemo(() => {
    if (!post?.content) return "";
    const raw = marked.parse(post.content, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [post?.content]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/80 font-sans">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "CHASE2SUCCESS" },
  };

  return (
    <>
      <SEO title={`${post.title} | CHASE2SUCCESS Blog`} description={post.excerpt} jsonLd={jsonLd} />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-sans mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {post.image_url && (
          <div className="rounded-lg overflow-hidden aspect-[16/9] mb-8">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-4 mb-6 text-sm text-foreground/80 font-sans">
          <span className="text-primary uppercase tracking-wider text-xs font-semibold">{post.category}</span>
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          )}
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{post.author}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">{post.title}</h1>

        <div
          className="prose prose-sm max-w-none font-sans
            [&_h1]:text-2xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mb-4 [&_h1]:mt-8
            [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:text-xl [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:text-foreground/80 [&_p]:leading-relaxed [&_p]:mb-4
            [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-6
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-foreground/80
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-foreground/80
            [&_li]:mb-1
            [&_a]:text-primary [&_a]:underline
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/80
            [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
            [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto
            [&_strong]:font-bold [&_strong]:text-foreground [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </div>
    </>
  );
};

export default BlogDetail;
