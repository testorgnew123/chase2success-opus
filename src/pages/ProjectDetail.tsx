import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  MapPin, ArrowLeft, ArrowRight, Download, X, ChevronLeft, ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/useProjects";
import SEO from "@/components/SEO";
import EnquirySection from "@/components/EnquirySection";
import { getAmenityIcon } from "@/data/amenities";

/* ─── Fullscreen Gallery Lightbox ─── */
const GalleryLightbox = ({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) => {
  const [current, setCurrent] = useState(startIndex);
  const touchStart = useRef<number | null>(null);
  const touchDelta = useRef(0);

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)), [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Touch / swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchDelta.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    touchDelta.current = e.touches[0].clientX - touchStart.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 60) {
      if (touchDelta.current > 0) prev();
      else next();
    }
    touchStart.current = null;
    touchDelta.current = 0;
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        aria-label="Close gallery"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm font-sans tracking-wide">
        {current + 1} / {images.length}
      </div>

      {/* Prev arrow (desktop) */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}

      {/* Next arrow (desktop) */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}

      {/* Image */}
      <div
        className="w-full h-full flex items-center justify-center px-4 md:px-20 py-16"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[current]}
          alt={`Gallery image ${current + 1}`}
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
        />
      </div>
    </div>
  );
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const { data: project, isLoading } = useProject(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/80 font-sans">Loading...</p>
      </div>
    );
  }

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

  const amenities = project.amenities ?? [];
  const gallery = project.gallery ?? [];

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
        description={`${project.short_description} Starting at ${project.price}. Premium ${project.type.toLowerCase()} in ${project.location}.`}
        jsonLd={jsonLd}
      />

      {/* Split-screen Hero */}
      <section className="relative min-h-[85vh] lg:min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh] lg:min-h-screen">
          <div className="relative flex flex-col justify-center bg-background px-6 sm:px-10 lg:px-16 xl:px-20 pb-12 pt-28 lg:pb-16 lg:pt-28 order-2 lg:order-1">
            <div className="absolute top-28 left-6 sm:left-10 lg:left-16 xl:left-20 w-px h-16 bg-primary/20 hidden lg:block" />
            <div className="mt-auto">
              <Link to="/projects" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-xs font-sans tracking-[0.15em] uppercase mb-8 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <span className="gold-gradient text-primary-foreground text-[10px] font-semibold px-3 py-1.5 rounded-sm uppercase tracking-widest">
                  {project.status}
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-foreground/80">
                  {project.type}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-[0.92] tracking-tight mb-4">
                {project.name.split(' ').length > 1 ? (
                  <>
                    <span className="line-clamp-2">{project.name.split(' ').slice(0, -1).join(' ')}</span>
                    <span className="font-editorial font-light italic gold-gradient-text text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
                      {project.name.split(' ').slice(-1)}
                    </span>
                  </>
                ) : (
                  <span className="font-editorial font-light italic gold-gradient-text text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
                    {project.name}
                  </span>
                )}
              </h1>
              <div className="editorial-divider mb-5" />
              <div className="flex items-center gap-1.5 text-foreground/80 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-sans text-sm">{project.location}</span>
              </div>
              {project.rera_number && (
                <p className="text-xs tracking-wide font-sans text-foreground/70 mb-4">RERA No: {project.rera_number}</p>
              )}
              <p className="font-editorial text-base text-foreground/80 leading-relaxed max-w-sm mb-8 line-clamp-3">
                {project.short_description}
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3 mb-12 lg:mb-16">
                <a href="#enquiry" className="group inline-flex items-center gap-3 gold-gradient text-primary-foreground font-sans text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:opacity-90 transition-opacity">
                  Enquire Now
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
                {project.brochure_url && (
                  <a href={project.brochure_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-border text-foreground font-sans text-xs font-medium tracking-[0.15em] uppercase px-8 py-4 h-auto hover:border-primary hover:text-primary transition-all">
                      <Download className="w-3.5 h-3.5 mr-2" />
                      Brochure
                    </Button>
                  </a>
                )}
              </div>
              <div className="flex items-center gap-8 lg:gap-12 border-t border-border pt-8">
                <div>
                  <p className="text-xl lg:text-2xl font-serif font-bold text-foreground leading-none mb-1">
                    {project.price.replace('Onwards', '').trim()}
                  </p>
                  <p className="text-[10px] tracking-[0.2em] uppercase font-sans text-foreground/80">Onwards</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-xl lg:text-2xl font-serif font-bold text-foreground leading-none mb-1">
                    {project.area.split('-')[0].trim() || project.area}
                  </p>
                  <p className="text-[10px] tracking-[0.2em] uppercase font-sans text-foreground/80">Area</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-xl lg:text-2xl font-serif font-bold text-foreground leading-none mb-1">
                    {amenities.length}
                  </p>
                  <p className="text-[10px] tracking-[0.2em] uppercase font-sans text-foreground/80">Amenities</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[45vh] lg:h-auto order-1 lg:order-2 overflow-hidden">
            <img src={project.image_url} alt={`${project.name} in ${project.location}`} className="w-full h-full object-cover object-center" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/20 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 bg-background/90 backdrop-blur-sm px-5 py-3 border border-border">
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans text-foreground/80 mb-1">Category</p>
              <p className="font-serif font-bold text-foreground text-sm">{project.type}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 md:py-28 space-y-20">
        <div className="max-w-3xl">
          <p className="editorial-label mb-4">About This Project</p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
            Project <span className="gold-gradient-text">Overview</span>
          </h2>
          <div className="editorial-divider mb-6" />
          <p className="text-foreground/80 font-sans leading-relaxed text-base">{project.description}</p>
        </div>

        {amenities.length > 0 && (
          <div>
            <p className="editorial-label mb-4">What's Included</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">
              Amenities & <span className="gold-gradient-text">Features</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amenities.map((amenity) => {
                const Icon = getAmenityIcon(amenity);
                return (
                  <div key={amenity} className="group relative bg-card border border-border rounded-lg p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:border-primary/40 hover:gold-glow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] gold-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center transition-colors duration-300 group-hover:border-primary/50 group-hover:bg-primary/5">
                      <Icon className="w-4.5 h-4.5 text-foreground/80 transition-colors duration-300 group-hover:text-primary" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-sans font-medium text-foreground/80 leading-tight tracking-wide">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {gallery.length > 0 && (
          <div>
            <p className="editorial-label mb-4">Visual Tour</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">
              Project <span className="gold-gradient-text">Gallery</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="rounded-lg overflow-hidden aspect-[4/3] cursor-pointer group"
                >
                  <img src={img} alt={`${project.name} gallery image ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </button>
              ))}
            </div>
            {lightboxIndex !== null && (
              <GalleryLightbox
                images={gallery}
                startIndex={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
              />
            )}
          </div>
        )}

        {project.map_url && (
          <div>
            <p className="editorial-label mb-4">Find Us</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">
              Location <span className="gold-gradient-text">Map</span>
            </h2>
            <div className="rounded-lg border border-border overflow-hidden">
              <iframe
                src={project.map_url}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${project.name} location map`}
              />
            </div>
          </div>
        )}
      </section>

      <EnquirySection projectName={project.name} />
    </>
  );
};

export default ProjectDetail;
