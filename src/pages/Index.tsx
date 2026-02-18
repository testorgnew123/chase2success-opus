import SEO from "@/components/SEO";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogPreview from "@/components/BlogPreview";
import EnquirySection from "@/components/EnquirySection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "CHASE2SUCCESS",
    description: "Premium luxury real estate advisory firm offering plots, farmhouses, and luxury residences.",
    url: "https://chase2success.com",
    telephone: "+919999999999",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Business Tower, Golf Course Road",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: "122002",
      addressCountry: "IN",
    },
  };

  return (
    <>
      <SEO
        title="CHASE2SUCCESS | Luxury Real Estate Investment Advisory"
        description="Premium luxury real estate advisory — plots, farmhouses, and luxury residences. Trusted by 500+ investors for high-ROI property investments in India."
        jsonLd={jsonLd}
      />
      <HeroSection />
      <AboutSection />
      <FeaturedProjects />
      <WhyChooseUs />
      <TestimonialsSection />
      <BlogPreview />
      <EnquirySection />
      <ContactSection />
    </>
  );
};

export default Index;
