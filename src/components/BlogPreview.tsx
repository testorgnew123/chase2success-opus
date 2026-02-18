import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogs";

const BlogPreview = () => {
  return (
    <section className="section-padding bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-sans">Insights</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Latest from Our <span className="gold-gradient-text">Blog</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-card border border-border rounded-lg overflow-hidden transition-all duration-500 hover:border-primary/50 hover:gold-glow"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs text-primary font-sans uppercase tracking-wider">{post.category}</p>
                <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors text-sm leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-1 text-primary text-xs font-semibold font-sans pt-1">
                  Read More <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
