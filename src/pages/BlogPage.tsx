import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBlogs, type DbBlog } from "@/hooks/useBlogs";
import SEO from "@/components/SEO";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import fallbackBlog1 from "@/assets/blog-1.jpg";
import fallbackBlog2 from "@/assets/blog-2.jpg";
import fallbackBlog3 from "@/assets/blog-3.jpg";
import fallbackBlog4 from "@/assets/blog-4.jpg";

const fallbackImages = [fallbackBlog1, fallbackBlog2, fallbackBlog3, fallbackBlog4];

const dateFormatter = new Intl.DateTimeFormat("en-IN", { year: "numeric", month: "long", day: "numeric" });

const BlogCard = memo(({ post, index }: { post: DbBlog; index: number }) => {
  const imgSrc = post.image_url
    ? optimizeCloudinaryUrl(post.image_url, { width: 700 })
    : fallbackImages[index % fallbackImages.length];

  return (
  <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-card border border-border rounded-lg overflow-hidden transition-all duration-500 hover:border-primary/50 hover:gold-glow">
    <div className="aspect-[16/9] overflow-hidden">
      <img src={imgSrc} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" />
    </div>
    <div className="p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-primary font-sans uppercase tracking-wider">{post.category}</span>
        {post.published_at && (
          <span className="text-xs text-foreground/80 font-sans">
            {dateFormatter.format(new Date(post.published_at))}
          </span>
        )}
      </div>
      <h2 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{post.title}</h2>
      <p className="text-sm text-foreground/80 leading-relaxed font-sans">{post.excerpt}</p>
      <div className="flex items-center gap-1 text-primary text-sm font-semibold font-sans pt-1">
        Read More <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  </Link>
  );
});
BlogCard.displayName = "BlogCard";

const BlogPage = () => {
  const { data: blogPosts, isLoading } = useBlogs();

  return (
    <>
      <SEO
        title="Real Estate Investment Blog | CHASE2SUCCESS"
        description="Expert insights on luxury real estate investment, market analysis, and property buying guides from CHASE2SUCCESS."
      />
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-sans">Insights</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Our <span className="gold-gradient-text">Blog</span>
          </h1>
          <p className="text-foreground/80 max-w-2xl mx-auto font-sans">
            Expert perspectives on luxury real estate markets, investment strategies, and premium living.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-foreground/80">Loading posts...</p>
        ) : !blogPosts || blogPosts.length === 0 ? (
          <p className="text-center text-foreground/80">No blog posts available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPage;
