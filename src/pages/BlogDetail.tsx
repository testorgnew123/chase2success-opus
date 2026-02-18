import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { blogPosts } from "@/data/blogs";
import SEO from "@/components/SEO";

const BlogDetail = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

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
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "CHASE2SUCCESS" },
  };

  return (
    <>
      <SEO title={post.metaTitle} description={post.metaDescription} jsonLd={jsonLd} />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-sans mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <div className="rounded-lg overflow-hidden aspect-[16/9] mb-8">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground font-sans">
          <span className="text-primary uppercase tracking-wider text-xs font-semibold">{post.category}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{post.author}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">{post.title}</h1>

        <div
          className="prose prose-invert prose-gold max-w-none font-sans
            [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:text-xl [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </>
  );
};

export default BlogDetail;
