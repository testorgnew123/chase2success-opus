import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-sans">Contact</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Reach <span className="gold-gradient-text">Out To Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-3 p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full gold-gradient mb-2">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-serif font-bold text-foreground">Address</h3>
            <p className="text-sm text-muted-foreground font-sans">123 Business Tower, Golf Course Road, Gurugram, Haryana 122002</p>
          </div>
          <div className="text-center space-y-3 p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full gold-gradient mb-2">
              <Phone className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-serif font-bold text-foreground">Phone</h3>
            <a href="tel:+919999999999" className="text-sm text-muted-foreground font-sans hover:text-primary transition-colors block">+91 99999 99999</a>
          </div>
          <div className="text-center space-y-3 p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full gold-gradient mb-2">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-serif font-bold text-foreground">WhatsApp</h3>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground font-sans hover:text-primary transition-colors block">+91 99999 99999</a>
          </div>
          <div className="text-center space-y-3 p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full gold-gradient mb-2">
              <Mail className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-serif font-bold text-foreground">Email</h3>
            <a href="mailto:info@chase2success.com" className="text-sm text-muted-foreground font-sans hover:text-primary transition-colors block">info@chase2success.com</a>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 rounded-lg overflow-hidden border border-border h-64 bg-secondary flex items-center justify-center">
          <p className="text-muted-foreground font-sans text-sm">Map will be embedded here</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
