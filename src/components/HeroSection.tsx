import { Link } from "react-router-dom";
import { ArrowRight, ArrowDownRight } from "lucide-react";
import heroBgWebp from "@/assets/hero-bg.webp";
import heroBgMobileWebp from "@/assets/hero-bg-mobile.webp";
import heroBgJpg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen">
      {/* Split layout: Left text panel + Right image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left — warm background with editorial text */}
        <div className="relative flex flex-col justify-end bg-background px-6 sm:px-10 lg:px-16 xl:px-20 pb-16 pt-32 lg:pb-20 lg:pt-28 order-2 lg:order-1">
          {/* Decorative vertical line */}
          <div className="absolute top-28 left-6 sm:left-10 lg:left-16 xl:left-20 w-px h-16 bg-primary/20 hidden lg:block" />

          <div className="mt-auto">
            <p className="editorial-label mb-6 lg:mb-8">
              Luxury Real Estate Advisory
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-[0.92] tracking-tight mb-6">
              Where
              <br />
              Luxury Meets
              <br />
              <span className="font-editorial font-light italic gold-gradient-text text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
                Investment
              </span>
            </h1>

            <div className="editorial-divider mb-6" />

            <p className="font-editorial text-base md:text-lg text-foreground/80 leading-relaxed max-w-sm mb-10">
              Premium plots, farmhouses & luxury residences — curated for India's most discerning investors.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-16 lg:mb-20">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-3 gold-gradient text-primary-foreground font-sans text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:opacity-90 transition-opacity"
              >
                Explore Projects
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#enquiry"
                className="group inline-flex items-center gap-3 border border-border text-foreground font-sans text-xs font-medium tracking-[0.2em] uppercase px-8 py-4 hover:border-primary hover:text-primary transition-all"
              >
                Enquire Now
                <ArrowDownRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </div>

            {/* Stats — horizontal, minimal */}
            <div className="flex items-center gap-8 lg:gap-12 border-t border-border pt-8">
              {[
                { value: "12+", label: "Years" },
                { value: "500+", label: "Clients" },
                { value: "₹150Cr", label: "Invested" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl lg:text-3xl font-serif font-bold text-foreground leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[10px] tracking-[0.2em] uppercase font-sans text-foreground/80">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — full-bleed image */}
        <div className="relative h-[50vh] lg:h-auto order-1 lg:order-2 overflow-hidden">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet={heroBgMobileWebp}
              type="image/webp"
            />
            <source
              srcSet={heroBgWebp}
              type="image/webp"
            />
            <img
              src={heroBgJpg}
              alt="Luxury real estate development by CHASE2SUCCESS"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={1920}
              height={1080}
            />
          </picture>
          {/* Subtle warm overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/20 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:hidden" />

          {/* Floating badge on image */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
