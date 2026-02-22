import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden transition-all duration-500 hover:border-primary/50 hover:gold-glow">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={project.image}
          alt={`${project.name} - ${project.type} in ${project.location}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="gold-gradient text-primary-foreground text-xs font-semibold px-3 py-1 rounded-sm uppercase tracking-wider">
            {project.status}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <div className="flex items-center gap-1 text-foreground/80 text-sm">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>{project.location}</span>
        </div>
        {project.rera_number && (
          <p className="text-[10px] tracking-wide font-sans text-foreground/70">RERA: {project.rera_number}</p>
        )}
        <p className="text-foreground/80 text-sm leading-relaxed">{project.shortDescription}</p>
        <p className="text-primary font-serif text-xl font-bold">{project.price}</p>
        <div className="flex gap-3 pt-2">
          <Link to={`/projects/${project.slug}`} className="flex-1">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm">
              View Details
            </Button>
          </Link>
          <a href="#enquiry" className="flex-1">
            <Button className="w-full gold-gradient text-primary-foreground text-sm hover:opacity-90">
              Enquire
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
