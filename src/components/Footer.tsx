import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <img src={logo} alt="CHASE2SUCCESS Logo" className="h-12 w-auto" />
            <p className="font-editorial text-base text-muted-foreground leading-relaxed max-w-sm">
              Premium luxury real estate advisory, connecting discerning investors with exceptional
              properties across India.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-foreground">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Projects", href: "/projects" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Projects */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-foreground">
              Our Projects
            </h4>
            <nav className="flex flex-col gap-3">
              {projects.map((p) => (
                <Link
                  key={p.slug}
                  to={`/projects/${p.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans"
                >
                  {p.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-foreground">
              Contact Info
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground font-sans">
              <p>123 Business Tower, Golf Course Road</p>
              <p>Gurugram, Haryana 122002</p>
              <a href="tel:+919999999999" className="hover:text-primary transition-colors block">
                +91 99999 99999
              </a>
              <a href="mailto:info@chase2success.com" className="hover:text-primary transition-colors block">
                info@chase2success.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-sans">
            © {new Date().getFullYear()} CHASE2SUCCESS. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors font-sans">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors font-sans">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
