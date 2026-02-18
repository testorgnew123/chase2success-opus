import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Years of Trust", value: 12, suffix: "+" },
  { label: "Happy Clients", value: 500, suffix: "+" },
  { label: "Projects Delivered", value: 25, suffix: "+" },
  { label: "Crores Invested", value: 150, suffix: "+" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-serif font-bold gold-gradient-text">
        {count}{suffix}
      </div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="section-padding max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-sans">About Us</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
          Building Trust, Delivering <span className="gold-gradient-text">Excellence</span>
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto text-base md:text-lg leading-relaxed font-sans">
          CHASE2SUCCESS is a premier luxury real estate advisory firm dedicated to connecting
          discerning investors with the finest properties across India. With over a decade of
          expertise, we combine market intelligence, legal transparency, and personalized
          consultation to deliver unmatched investment outcomes. Our commitment to trust and
          excellence has made us the preferred partner for high-net-worth individuals seeking
          premium real estate opportunities.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center space-y-2">
            <Counter target={stat.value} suffix={stat.suffix} />
            <p className="text-muted-foreground text-sm font-sans tracking-wide uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
