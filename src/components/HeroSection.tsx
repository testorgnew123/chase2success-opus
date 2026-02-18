import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury real estate development by CHASE2SUCCESS"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-20 md:pb-28">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-bold leading-[0.95] tracking-tight mb-8 animate-fade-up">
          Where Luxury
          <br />
          Meets <span className="gold-gradient-text">Investment</span>
        </h1>
        <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-up-delay-1">
          <Link to="/projects">
            <Button size="lg" className="gold-gradient text-primary-foreground font-semibold px-10 py-7 text-base hover:opacity-90 transition-opacity tracking-wide">
              View Projects
            </Button>
          </Link>
          <a href="#enquiry">
            <Button size="lg" variant="outline" className="border-primary text-primary px-10 py-7 text-base hover:bg-primary hover:text-primary-foreground transition-all tracking-wide">
              Enquire Now
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
