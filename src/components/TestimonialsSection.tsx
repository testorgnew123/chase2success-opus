import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-sans">Testimonials</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
          What Our <span className="gold-gradient-text">Clients Say</span>
        </h2>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-card border border-border rounded-lg p-6 space-y-4 hover:border-primary/50 transition-colors">
            <div className="flex gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic font-sans">"{t.content}"</p>
            <div>
              <p className="font-serif font-bold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground font-sans">{t.designation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile slider */}
      <div className="md:hidden relative">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex gap-1">
            {Array.from({ length: testimonials[current].rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed italic font-sans">
            "{testimonials[current].content}"
          </p>
          <div>
            <p className="font-serif font-bold text-foreground">{testimonials[current].name}</p>
            <p className="text-xs text-muted-foreground font-sans">{testimonials[current].designation}</p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)} className="text-primary hover:text-primary/80" aria-label="Previous testimonial">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <button onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)} className="text-primary hover:text-primary/80" aria-label="Next testimonial">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
