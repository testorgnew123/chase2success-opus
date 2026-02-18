import SEO from "@/components/SEO";
import AboutSection from "@/components/AboutSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import EnquirySection from "@/components/EnquirySection";

const AboutPage = () => {
  return (
    <>
      <SEO
        title="About CHASE2SUCCESS | Trusted Luxury Real Estate Advisory"
        description="Learn about CHASE2SUCCESS — India's premier luxury real estate advisory firm with 12+ years of trust, 500+ happy clients, and 25+ projects delivered."
      />
      <div className="pt-24">
        <div className="text-center mb-8 px-4">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-sans">Our Story</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            About <span className="gold-gradient-text">CHASE2SUCCESS</span>
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto font-sans leading-relaxed">
            Founded with a vision to transform how India's discerning investors approach luxury real estate,
            CHASE2SUCCESS has grown into a trusted name synonymous with premium properties, transparent dealings,
            and exceptional returns. Our journey of over a decade has been marked by an unwavering commitment
            to our clients' success.
          </p>
        </div>
        <AboutSection />
        <WhyChooseUs />
        <TestimonialsSection />
        <EnquirySection />
      </div>
    </>
  );
};

export default AboutPage;
