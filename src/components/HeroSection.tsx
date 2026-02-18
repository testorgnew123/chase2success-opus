import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Full-bleed hero image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury real estate development by CHASE2SUCCESS"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content — pinned to bottom with generous whitespace */}
      <div className="relative z-10 mt-auto pb-20 md:pb-28 lg:pb-32 px-6 sm:px-10 lg:px-16 max-w-6xl">
        <p className="text-primary/80 font-sans text-[11px] md:text-xs tracking-[0.4em] uppercase mb-5 animate-fade-up">
          Real Estate Advisory
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-bold leading-[0.95] tracking-tight mb-8 animate-fade-up-delay-1">
          Where Luxury<br />
          Meets <span className="gold-gradient-text">Investment</span>
        </h1>
        <div className="flex items-center gap-5 animate-fade-up-delay-2">
          <Link to="/projects">
            <Button size="lg" className="gold-gradient text-primary-foreground font-semibold px-10 py-6 text-sm tracking-wide hover:opacity-90 transition-opacity">
              View Projects
            </Button>
          </Link>
          <a href="#enquiry">
            <Button size="lg" variant="outline" className="border-foreground/20 text-foreground px-10 py-6 text-sm tracking-wide hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
              Enquire Now
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
