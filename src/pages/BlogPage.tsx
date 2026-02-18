import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogs";
import SEO from "@/components/SEO";

const BlogPage = () => {
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
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
            Expert perspectives on luxury real estate markets, investment strategies, and premium living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-card border border-border rounded-lg overflow-hidden transition-all duration-500 hover:border-primary/50 hover:gold-glow">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-primary font-sans uppercase tracking-wider">{post.category}</span>
                  <span className="text-xs text-muted-foreground font-sans">{new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
                <h2 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">{post.excerpt}</p>
                <div className="flex items-center gap-1 text-primary text-sm font-semibold font-sans pt-1">
                  Read More <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
