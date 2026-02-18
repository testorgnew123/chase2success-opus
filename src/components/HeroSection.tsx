import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury real estate development by CHASE2SUCCESS"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <p className="text-primary font-sans text-sm md:text-base tracking-[0.3em] uppercase mb-6 animate-fade-up">
          Premium Real Estate Advisory
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6 animate-fade-up-delay-1">
          Where Luxury Meets{" "}
          <span className="gold-gradient-text">Smart Investment</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-sans mb-10 max-w-2xl mx-auto animate-fade-up-delay-2">
          Premium Plots · Farmhouses · Luxury Residences
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-2">
          <Link to="/projects">
            <Button size="lg" className="gold-gradient text-primary-foreground font-semibold px-8 py-6 text-base hover:opacity-90 transition-opacity">
              View Projects
            </Button>
          </Link>
          <a href="#enquiry">
            <Button size="lg" variant="outline" className="border-primary text-primary px-8 py-6 text-base hover:bg-primary hover:text-primary-foreground transition-all">
              Enquire Now
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
