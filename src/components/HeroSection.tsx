import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Full-bleed hero image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury real estate development by CHASE2SUCCESS"
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
        {/* Darker overlays for contrast */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Editorial content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pb-16 md:pb-24 lg:pb-32 pt-32">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-8 animate-fade-up">
            <div className="w-12 h-px bg-white/40" />
            <p className="text-[11px] tracking-[0.35em] uppercase font-sans text-white/60">
              Real Estate Advisory
            </p>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[8rem] font-serif font-bold leading-[0.9] tracking-tight mb-8 animate-fade-up-delay-1 text-white">
            Where Luxury
            <br />
            Meets{" "}
            <span className="font-editorial font-light italic gold-gradient-text">
              Investment
            </span>
          </h1>

          <p className="font-editorial text-lg md:text-xl text-white/60 max-w-md leading-relaxed mb-12 animate-fade-up-delay-1">
            Premium plots, farmhouses & luxury residences — curated for the discerning investor.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-up-delay-2">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-3 gold-gradient text-primary-foreground font-sans text-sm font-semibold tracking-wider uppercase px-10 py-4 hover:opacity-90 transition-opacity"
            >
              Explore Projects
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#enquiry"
              className="group inline-flex items-center gap-3 border border-white/25 text-white font-sans text-sm font-medium tracking-wider uppercase px-10 py-4 hover:bg-white/10 hover:border-white/40 transition-all"
            >
              Make an Enquiry
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="hidden lg:flex items-center gap-16 mt-20 pt-8 border-t border-white/10">
          {[
            { value: "12+", label: "Years Experience" },
            { value: "500+", label: "Happy Clients" },
            { value: "₹150Cr+", label: "Worth Invested" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-3">
              <span className="text-2xl font-serif font-bold text-white">{stat.value}</span>
              <span className="text-[11px] tracking-[0.2em] uppercase font-sans text-white/40">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
