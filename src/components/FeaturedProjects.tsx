import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

const FeaturedProjects = () => {
  return (
    <section id="projects" className="section-padding max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-sans">Our Portfolio</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
          Featured <span className="gold-gradient-text">Projects</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
          Handpicked luxury properties offering exceptional value and lifestyle in prime locations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;
