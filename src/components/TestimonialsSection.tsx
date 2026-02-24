import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";

const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useTestimonials();
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Only start carousel timer when section is visible on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !testimonials || testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials, isVisible]);

  if (isLoading || !testimonials || testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} className="section-padding bg-card/40">
      <div className="max-w-[1440px] mx-auto">
        {/* Editorial header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="editorial-divider" />
          <p className="editorial-label">Testimonials</p>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-16">
          What Our Clients{" "}
          <em className="font-editorial font-light italic gold-gradient-text not-italic">Say</em>
        </h2>

        {/* Desktop — editorial large-quote + grid */}
        <div className="hidden md:grid grid-cols-12 gap-8">
          {/* Featured testimonial */}
          <div className="col-span-5 border-l-2 border-primary/30 pl-8 py-4">
            <div className="flex gap-0.5 mb-6">
              {Array.from({ length: testimonials[0].rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="font-editorial text-xl md:text-2xl text-foreground leading-[1.6] mb-8 italic">
              "{testimonials[0].content}"
            </blockquote>
            <div>
              <p className="font-serif font-bold text-foreground">{testimonials[0].name}</p>
              <p className="text-xs text-foreground/80 font-sans tracking-wide mt-1">
                {testimonials[0].role}
              </p>
            </div>
          </div>

          {/* Other testimonials */}
          <div className="col-span-7 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testimonials.slice(1).map((t) => (
              <div
                key={t.id}
                className="border border-border p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed italic font-editorial mb-5">
                  "{t.content}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-serif font-bold text-foreground text-sm">{t.name}</p>
                  <p className="text-[11px] text-foreground/80 font-sans">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile slider */}
        <div className="md:hidden">
          <div className="border-l-2 border-primary/30 pl-6 py-2">
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="font-editorial text-lg text-foreground leading-relaxed italic mb-6">
              "{testimonials[current].content}"
            </blockquote>
            <div>
              <p className="font-serif font-bold text-foreground">{testimonials[current].name}</p>
              <p className="text-xs text-foreground/80 font-sans">{testimonials[current].role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="text-primary hover:text-primary/70 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-0.5 transition-colors ${
                    i === current ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
              className="text-primary hover:text-primary/70 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
