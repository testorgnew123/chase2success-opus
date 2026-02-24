import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const contacts = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: [{ text: "S NO. FF-51 First Floor, Riviera Manhattan, Plot No. 1-8, Ramchandrapura, Mahal Road, Jagatpura, Jaipur, Rajasthan 302017" }],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: [
      { text: "+91 9872404280", href: "tel:+919872404280" },
      { text: "+91 9887349448", href: "tel:+919887349448" },
    ],
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    lines: [
      { text: "+91 9872404280", href: "https://wa.me/919872404280" },
      { text: "+91 9887349448", href: "https://wa.me/919887349448" },
    ],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: [{ text: "info@chase2success.com", href: "mailto:info@chase2success.com" }],
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
              {contacts.map((c) => (
                <div
                  key={c.title}
                  className="group border border-border p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                      <c.icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-serif font-bold text-foreground text-sm">{c.title}</h3>
                  </div>
                  {c.lines.map((line, i) =>
                    line.href ? (
                      <a
                        key={i}
                        href={line.href}
                        target={line.href.startsWith("http") ? "_blank" : undefined}
                        rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="block text-sm text-foreground/80 font-sans leading-relaxed hover:text-primary transition-colors"
                      >
                        {line.text}
                      </a>
                    ) : (
                      <p key={i} className="text-sm text-foreground/80 font-sans leading-relaxed">
                        {line.text}
                      </p>
                    )
                  )}
                </div>
              ))}
            </div>

            {/* Office Location Map */}
            <div className="mt-8 border border-border overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.7591251446015!2d75.862954!3d26.7839471!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9a782efd35f%3A0x81ea6e515dc9956f!2sManhattan%20Riviera!5e0!3m2!1sen!2sin!4v1771950374379!5m2!1sen!2sin"
                width="100%"
                height="224"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CHASE2SUCCESS Office Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
