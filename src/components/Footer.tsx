import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="CHASE2SUCCESS Logo" className="h-14 w-auto" />
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              Premium luxury real estate advisory, connecting discerning investors with exceptional properties across India.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-foreground">Quick Links</h4>
            <div className="h-0.5 w-12 gold-gradient rounded" />
            <nav className="flex flex-col gap-2">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Projects", href: "/projects" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link key={link.href} to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Projects */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-foreground">Our Projects</h4>
            <div className="h-0.5 w-12 gold-gradient rounded" />
            <nav className="flex flex-col gap-2">
              {projects.map((p) => (
                <Link key={p.slug} to={`/projects/${p.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans">
                  {p.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-foreground">Contact Info</h4>
            <div className="h-0.5 w-12 gold-gradient rounded" />
            <div className="space-y-2 text-sm text-muted-foreground font-sans">
              <p>123 Business Tower, Golf Course Road</p>
              <p>Gurugram, Haryana 122002</p>
              <a href="tel:+919999999999" className="hover:text-primary transition-colors block">+91 99999 99999</a>
              <a href="mailto:info@chase2success.com" className="hover:text-primary transition-colors block">info@chase2success.com</a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-sans">
            © {new Date().getFullYear()} CHASE2SUCCESS. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors font-sans">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors font-sans">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
