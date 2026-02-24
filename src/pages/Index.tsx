import { lazy, Suspense, useState, useEffect } from "react";
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

/**
 * Defer below-fold sections until the browser is idle.
 * This prevents the Neon SDK + auth handshake from firing before LCP,
 * keeping the critical path focused on hero image + CSS.
 */
const useDeferredRender = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const schedule = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 200));
    const id = schedule(() => setReady(true));
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
    };
  }, []);
  return ready;
};

const Index = () => {
  const showBelowFold = useDeferredRender();

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
      {showBelowFold && (
        <Suspense fallback={null}>
          <AboutSection />
          <FeaturedProjects />
          <WhyChooseUs />
          <TestimonialsSection />
          <BlogPreview />
          <EnquirySection />
          <ContactSection />
        </Suspense>
      )}
    </>
  );
};

export default Index;
