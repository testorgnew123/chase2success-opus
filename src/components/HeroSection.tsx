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
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Editorial content — asymmetric, bottom-left */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pb-20 md:pb-28 lg:pb-36 pt-32">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-8 animate-fade-up">
            <div className="editorial-divider" />
            <p className="editorial-label">
              Real Estate Advisory
            </p>
          </div>

          <h1 className="text-[clamp(2.5rem,7vw,7rem)] font-serif font-bold leading-[0.9] tracking-tight mb-8 animate-fade-up-delay-1">
            Where Luxury
            <br />
            Meets{" "}
            <em className="font-editorial font-light italic text-primary not-italic gold-gradient-text">
              Investment
            </em>
          </h1>

          <p className="font-editorial text-lg md:text-xl text-foreground/60 max-w-md leading-relaxed mb-10 animate-fade-up-delay-1">
            Premium plots, farmhouses & luxury residences — curated for the discerning investor.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-up-delay-2">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-3 gold-gradient text-primary-foreground font-sans text-sm font-semibold tracking-wide px-8 py-4 hover:opacity-90 transition-opacity"
            >
              Explore Projects
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#enquiry"
              className="group inline-flex items-center gap-3 border border-foreground/20 text-foreground font-sans text-sm font-medium tracking-wide px-8 py-4 hover:border-primary hover:text-primary transition-all"
            >
              Make an Enquiry
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
