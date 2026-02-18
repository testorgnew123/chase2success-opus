import SEO from "@/components/SEO";
import ContactSection from "@/components/ContactSection";
import EnquirySection from "@/components/EnquirySection";

const ContactPage = () => {
  return (
    <>
      <SEO
        title="Contact CHASE2SUCCESS | Luxury Real Estate Advisory"
        description="Get in touch with CHASE2SUCCESS for premium real estate advisory. Call, WhatsApp, or visit our office for personalized consultation."
      />
      <div className="pt-24">
        <div className="text-center mb-8 px-4">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-sans">Get In Touch</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Contact <span className="gold-gradient-text">Us</span>
          </h1>
        </div>
        <EnquirySection />
        <ContactSection />
      </div>
    </>
  );
};

export default ContactPage;
