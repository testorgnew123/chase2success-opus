import { lazy, Suspense } from "react";
import SEO from "@/components/SEO";
import HeroSection from "@/components/HeroSection";

// Lazy-load below-the-fold sections to reduce initial bundle size
const AboutSection = lazy(() => import("@/components/AboutSection"));
const FeaturedProjects = lazy(() => import("@/components/FeaturedProjects"));
const WhyChooseUs = lazy(() => import("@/components/WhyChooseUs"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const EnquirySection = lazy(() => import("@/components/EnquirySection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "CHASE2SUCCESS",
    description: "Premium luxury real estate advisory firm offering plots, farmhouses, and luxury residences.",
    url: "https://chase2success.com",
    telephone: "+919872404280",
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
      <Suspense fallback={null}>
        <AboutSection />
        <FeaturedProjects />
        <WhyChooseUs />
        <TestimonialsSection />
        <BlogPreview />
        <EnquirySection />
        <ContactSection />
      </Suspense>
    </>
  );
};

export default Index;
