import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import SEO from "@/components/SEO";

const ProjectsPage = () => {
  return (
    <>
      <SEO
        title="Luxury Real Estate Projects | CHASE2SUCCESS"
        description="Explore premium plots, farmhouses, luxury residences, and high-end real estate investments curated by CHASE2SUCCESS."
      />
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-sans">Our Portfolio</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            All <span className="gold-gradient-text">Projects</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
            Discover our complete collection of premium real estate opportunities across India's most coveted locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group bg-card border border-border rounded-lg overflow-hidden transition-all duration-500 hover:border-primary/50 hover:gold-glow">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img src={project.image} alt={`${project.name} - ${project.type}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute top-4 left-4">
                  <span className="gold-gradient text-primary-foreground text-xs font-semibold px-3 py-1 rounded-sm uppercase tracking-wider">{project.status}</span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h2 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{project.name}</h2>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MapPin className="w-3.5 h-3.5 text-primary" /><span>{project.location}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{project.shortDescription}</p>
                <p className="text-primary font-serif text-xl font-bold">{project.price}</p>
                <div className="flex gap-3 pt-2">
                  <Link to={`/projects/${project.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm">View Details</Button>
                  </Link>
                  <a href="#enquiry" className="flex-1">
                    <Button className="w-full gold-gradient text-primary-foreground text-sm hover:opacity-90">Enquire</Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
