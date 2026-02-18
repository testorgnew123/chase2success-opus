import { useParams, Link } from "react-router-dom";
import {
  MapPin, ArrowLeft, Download, ShieldCheck, Trees, Waves, Home,
  Dumbbell, Car, Sparkles, Flower2, Wine, Theater, Eye, Zap,
  CloudRain, Sun, Gamepad2, BriefcaseBusiness, Fence, Baby,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import SEO from "@/components/SEO";
import EnquirySection from "@/components/EnquirySection";

/* Map amenity keywords → icons for visual richness */
const amenityIconMap: Record<string, LucideIcon> = {
  "gated community": Fence,
  "24/7 security": ShieldCheck,
  "landscaped gardens": Flower2,
  "club house": Home,
  "swimming pool": Waves,
  "jogging track": Dumbbell,
  "children's play area": Baby,
  "underground electrification": Zap,
  "private garden": Flower2,
  "organic farm": Trees,
  "horse riding": Sparkles,
  "spa & wellness": Sparkles,
  "helipad access": Sun,
  "concierge service": BriefcaseBusiness,
  "concierge": BriefcaseBusiness,
  "wine cellar": Wine,
  "private elevator": Home,
  "infinity pool": Waves,
  "sky lounge": Eye,
  "smart home": Zap,
  "valet parking": Car,
  "private theater": Theater,
  "home theater": Theater,
  "rooftop observatory": Eye,
  "rooftop garden": Flower2,
  "business center": BriefcaseBusiness,
  "indoor games": Gamepad2,
  "gymnasium": Dumbbell,
  "meditation zone": Sparkles,
  "ev charging": Zap,
  "solar powered": Sun,
  "rainwater harvesting": CloudRain,
  "private golf course": Trees,
  "equestrian club": Sparkles,
  "italian marble": Sparkles,
  "private courtyard": Flower2,
  "guest house": Home,
  "staff quarters": Home,
};

const getAmenityIcon = (amenity: string): LucideIcon => {
  return amenityIconMap[amenity.toLowerCase()] || Sparkles;
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Project Not Found</h1>
          <Link to="/projects" className="text-primary hover:underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: project.description,
    url: `https://chase2success.com/projects/${project.slug}`,
    offers: { "@type": "Offer", price: project.price, priceCurrency: "INR" },
    address: { "@type": "PostalAddress", addressLocality: project.location, addressCountry: "IN" },
  };

  return (
    <>
      <SEO
        title={`${project.name} - ${project.type} | CHASE2SUCCESS`}
        description={`${project.shortDescription} Starting at ${project.price}. Premium ${project.type.toLowerCase()} in ${project.location}.`}
        jsonLd={jsonLd}
      />
      <div className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
        <Link to="/projects" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-sans mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        {/* Hero Image */}
        <div className="rounded-lg overflow-hidden aspect-[21/9] mb-8">
          <img src={project.image} alt={`${project.name} in ${project.location}`} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="gold-gradient text-primary-foreground text-xs font-semibold px-3 py-1 rounded-sm uppercase">{project.status}</span>
                <span className="text-xs text-muted-foreground font-sans uppercase">{project.type}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">{project.name}</h1>
              <div className="flex items-center gap-1 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-sans text-sm">{project.location}</span>
              </div>
              <p className="text-2xl font-serif font-bold text-primary mb-6">{project.price}</p>
              <p className="text-muted-foreground font-sans leading-relaxed">{project.description}</p>
            </div>

            {/* Amenities — Premium Cards */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">Amenities & <span className="gold-gradient-text">Features</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.amenities.map((amenity) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div
                      key={amenity}
                      className="group relative bg-card border border-border rounded-lg p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:border-primary/40 hover:gold-glow"
                    >
                      {/* Subtle gold accent line at top */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] gold-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center transition-colors duration-300 group-hover:border-primary/50 group-hover:bg-primary/5">
                        <Icon className="w-4.5 h-4.5 text-muted-foreground transition-colors duration-300 group-hover:text-primary" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-sans font-medium text-foreground/80 leading-tight tracking-wide">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-4">Project <span className="gold-gradient-text">Gallery</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.gallery.map((img, i) => (
                  <div key={i} className="rounded-lg overflow-hidden aspect-[4/3]">
                    <img src={img} alt={`${project.name} gallery image ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-4">Location <span className="gold-gradient-text">Map</span></h2>
              <div className="rounded-lg border border-border h-64 bg-secondary flex items-center justify-center">
                <p className="text-muted-foreground font-sans text-sm">Map will be embedded here</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 sticky top-24">
              <h3 className="font-serif font-bold text-lg">Interested?</h3>
              <p className="text-sm text-muted-foreground font-sans">Get exclusive details, pricing, and site visit options for {project.name}.</p>
              <a href="#enquiry">
                <Button className="w-full gold-gradient text-primary-foreground font-semibold hover:opacity-90">
                  Enquire Now
                </Button>
              </a>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Download className="w-4 h-4 mr-2" />
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </div>
      <EnquirySection />
    </>
  );
};

export default ProjectDetail;
