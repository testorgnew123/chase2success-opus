import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Years of Trust", value: 12, suffix: "+" },
  { label: "Happy Clients", value: 500, suffix: "+" },
  { label: "Projects Delivered", value: 25, suffix: "+" },
  { label: "Crores Invested", value: 150, suffix: "Cr+" },
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
    <div ref={ref}>
      <div className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold gold-gradient-text leading-none">
        {count}{suffix}
      </div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-[1440px] mx-auto">
        {/* Editorial asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">
          {/* Left column — label + heading */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="editorial-divider" />
              <p className="editorial-label">About Us</p>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-[1.05]">
              Building Trust,
              <br />
              Delivering{" "}
              <em className="font-editorial font-light italic gold-gradient-text not-italic">
                Excellence
              </em>
            </h2>
          </div>

          {/* Right column — body text */}
          <div className="lg:col-span-7 lg:pt-6">
            <p className="font-editorial text-lg md:text-xl text-muted-foreground leading-[1.7] mb-6">
              CHASE2SUCCESS is a premier luxury real estate advisory firm dedicated to connecting
              discerning investors with the finest properties across India.
            </p>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              With over a decade of expertise, we combine market intelligence, legal transparency,
              and personalized consultation to deliver unmatched investment outcomes. Our commitment
              to trust and excellence has made us the preferred partner for high-net-worth
              individuals seeking premium real estate opportunities.
            </p>
          </div>
        </div>

        {/* Stats — editorial horizontal layout */}
        <div className="border-t border-border pt-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-3">
                <Counter target={stat.value} suffix={stat.suffix} />
                <p className="text-xs text-muted-foreground font-sans tracking-[0.2em] uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
