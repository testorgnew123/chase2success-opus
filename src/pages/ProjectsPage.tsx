import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { useProjects, type DbProject } from "@/hooks/useProjects";
import SEO from "@/components/SEO";

const ProjectsPage = () => {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/80 font-sans">Loading projects...</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-foreground/80 font-sans">No projects available yet.</p>
      </div>
    );
  }

  // Prioritize featured projects for the hero section
  const sorted = [...projects].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return 0;
  });

  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <>
      <SEO
        title="Luxury Real Estate Projects | CHASE2SUCCESS"
        description="Explore premium plots, farmhouses, luxury residences, and high-end real estate investments curated by CHASE2SUCCESS."
      />

      {/* Hero / Featured Project */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <img
          src={featured.image_url}
          alt={`${featured.name} - ${featured.type}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-16 md:pb-20">
          <p className="text-primary text-[11px] tracking-[0.4em] uppercase mb-4 font-sans">Featured Project</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[0.95] tracking-tight mb-4 text-white">
            {featured.name}
          </h1>
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{featured.location}</span>
            <span className="mx-2 text-white/40">|</span>
            <span>{featured.type}</span>
          </div>
          <p className="text-white/80 max-w-xl text-sm leading-relaxed mb-6">{featured.short_description}</p>
          <div className="flex items-center gap-4">
            <p className="text-primary font-serif text-2xl font-bold">{featured.price}</p>
            <Link to={`/projects/${featured.slug}`}>
              <Button className="gold-gradient text-primary-foreground px-8 py-5 text-sm tracking-wide hover:opacity-90 transition-opacity group">
                View Details
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* All Projects Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 md:py-28">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-primary/70 text-[11px] tracking-[0.4em] uppercase mb-3 font-sans">Our Portfolio</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              All <span className="gold-gradient-text">Projects</span>
            </h2>
          </div>
          <p className="hidden md:block text-foreground/80 text-sm max-w-xs text-right">
            Discover premium real estate across India's most coveted locations.
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rest.slice(0, 2).map((project) => (
              <ProjectCardLarge key={project.id} project={project} />
            ))}
          </div>
          {rest.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.slice(2).map((project) => (
                <ProjectCardCompact key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

import { Button } from "@/components/ui/button";

const ProjectCardLarge = ({ project }: { project: DbProject }) => (
  <Link to={`/projects/${project.slug}`} className="group block">
    <div className="relative overflow-hidden rounded-sm aspect-[3/4] md:aspect-[4/5]">
      <img
        src={project.image_url}
        alt={`${project.name} - ${project.type}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute top-5 left-5">
        <span className="gold-gradient text-primary-foreground text-[10px] font-semibold px-3 py-1.5 rounded-sm uppercase tracking-widest">
          {project.status}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <p className="text-primary font-serif text-xl font-bold mb-2">{project.price}</p>
        <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <div className="flex items-center gap-1.5 text-foreground/80 text-sm">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>{project.location}</span>
        </div>
        {project.rera_number && (
          <p className="text-[10px] tracking-wide font-sans text-foreground/60 mt-1">RERA: {project.rera_number}</p>
        )}
      </div>
    </div>
  </Link>
);

const ProjectCardCompact = ({ project }: { project: DbProject }) => (
  <Link to={`/projects/${project.slug}`} className="group block">
    <div className="overflow-hidden rounded-sm">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.image_url}
          alt={`${project.name} - ${project.type}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="gold-gradient text-primary-foreground text-[10px] font-semibold px-3 py-1 rounded-sm uppercase tracking-widest">
            {project.status}
          </span>
        </div>
      </div>
      <div className="pt-5 space-y-2">
        <h3 className="text-lg font-serif font-bold text-foreground group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <div className="flex items-center gap-1.5 text-foreground/80 text-xs">
          <MapPin className="w-3 h-3 text-primary" />
          <span>{project.location}</span>
        </div>
        {project.rera_number && (
          <p className="text-[10px] tracking-wide font-sans text-foreground/60">RERA: {project.rera_number}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <p className="text-primary font-serif text-lg font-bold">{project.price}</p>
          <span className="text-foreground/80 text-xs tracking-wide uppercase group-hover:text-primary transition-colors flex items-center gap-1">
            View
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  </Link>
);

export default ProjectsPage;
