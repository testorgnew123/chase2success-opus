import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const contacts = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["123 Business Tower, Golf Course Road", "Gurugram, Haryana 122002"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+91 9872404280"],
    href: "tel:+919872404280",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    lines: ["+91 9872404280"],
    href: "https://wa.me/919872404280",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["info@chase2success.com"],
    href: "mailto:info@chase2success.com",
  },
];

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left — heading */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="editorial-divider" />
              <p className="editorial-label">Contact</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-[1.05] mb-6">
              Reach{" "}
              <em className="font-editorial font-light italic gold-gradient-text not-italic">
                Out To Us
              </em>
            </h2>
            <p className="font-editorial text-lg text-foreground/80 leading-relaxed">
              We'd love to hear from you. Get in touch through any of these channels.
            </p>
          </div>

          {/* Right — contact cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contacts.map((c) => {
                const Wrapper = c.href ? "a" : "div";
                const wrapperProps = c.href
                  ? { href: c.href, target: c.href.startsWith("http") ? "_blank" : undefined, rel: c.href.startsWith("http") ? "noopener noreferrer" : undefined }
                  : {};
                return (
                  <Wrapper
                    key={c.title}
                    {...(wrapperProps as any)}
                    className="group border border-border p-6 hover:border-primary/30 transition-colors block"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                        <c.icon className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-serif font-bold text-foreground text-sm">{c.title}</h3>
                    </div>
                    {c.lines.map((line, i) => (
                      <p key={i} className="text-sm text-foreground/80 font-sans leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </Wrapper>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 border border-border h-56 flex items-center justify-center">
              <p className="text-foreground/80 font-sans text-sm">Map will be embedded here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
