import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBlogs } from "@/hooks/useBlogs";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

const BlogPreview = () => {
  const { data: blogPosts, isLoading } = useBlogs();

  if (isLoading || !blogPosts || blogPosts.length === 0) return null;

  const featured = blogPosts[0];
  const rest = blogPosts.slice(1, 4);

  return (
    <section className="section-padding">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="editorial-divider" />
              <p className="editorial-label">Insights</p>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-[1.05]">
              Latest from Our{" "}
              <em className="font-editorial font-light italic gold-gradient-text not-italic">Blog</em>
            </h2>
          </div>
          <Link to="/blog" className="group inline-flex items-center gap-2 text-sm font-sans text-primary font-medium tracking-wide hover:gap-3 transition-all">
            All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Link to={`/blog/${featured.slug}`} className="lg:col-span-7 group block">
            {featured.image_url && (
              <div className="relative aspect-[16/10] overflow-hidden mb-6">
                <img src={optimizeCloudinaryUrl(featured.image_url, { width: 800 })} alt={featured.title} className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" loading="lazy" decoding="async" />
              </div>
            )}
            <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-primary/60 mb-3">{featured.category}</p>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors mb-3 leading-tight">{featured.title}</h3>
            <p className="text-sm text-foreground/80 font-sans leading-relaxed max-w-lg line-clamp-2">{featured.excerpt}</p>
          </Link>

          <div className="lg:col-span-5 flex flex-col divide-y divide-border">
            {rest.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group flex gap-5 py-6 first:pt-0 last:pb-0">
                {post.image_url && (
                  <div className="relative overflow-hidden w-24 h-24 flex-shrink-0">
                    <img src={optimizeCloudinaryUrl(post.image_url, { width: 200 })} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-primary/60 mb-2">{post.category}</p>
                  <h3 className="text-sm font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-1">{post.title}</h3>
                  <p className="text-xs text-foreground/80 font-sans line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
