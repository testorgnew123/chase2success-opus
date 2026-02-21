import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

const FeaturedProjects = () => {
  const { data: projects, isLoading } = useProjects();

  if (isLoading || !projects || projects.length === 0) {
    return null;
  }

  const featured = projects[0];
  const secondary = projects.slice(1, 4);

  return (
    <section id="projects" className="section-padding bg-card/40">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="editorial-divider" />
              <p className="editorial-label">Our Portfolio</p>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-[1.05]">
              Featured{" "}
              <em className="font-editorial font-light italic gold-gradient-text not-italic">
                Projects
              </em>
            </h2>
          </div>
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 text-sm font-sans text-primary font-medium tracking-wide hover:gap-3 transition-all"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <Link to={`/projects/${featured.slug}`} className="lg:col-span-7 group block">
            <div className="relative overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
              <img
                src={featured.image_url}
                alt={`${featured.name} - ${featured.type}`}
                className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
              <div className="absolute top-6 left-6">
                <span className="gold-gradient text-primary-foreground text-[10px] font-sans font-semibold px-4 py-1.5 tracking-[0.2em] uppercase">
                  {featured.status}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <p className="editorial-label text-primary-foreground/60 mb-3">{featured.type}</p>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary-foreground mb-3 group-hover:text-primary transition-colors duration-500">
                  {featured.name}
                </h3>
                <div className="flex items-center gap-2 text-primary-foreground/60 text-sm font-sans mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{featured.location}</span>
                </div>
                <p className="font-editorial text-xl text-primary font-semibold">
                  {featured.price}
                </p>
              </div>
            </div>
          </Link>

          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            {secondary.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className="group flex gap-5 items-start"
              >
                <div className="relative overflow-hidden w-28 h-28 md:w-36 md:h-36 flex-shrink-0">
                  <img
                    src={project.image_url}
                    alt={`${project.name} - ${project.type}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 py-1">
                  <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-primary/60 mb-2">
                    {project.type}
                  </p>
                  <h3 className="text-base md:text-lg font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2 leading-tight">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-sans mb-2">
                    <MapPin className="w-3 h-3 text-primary/50" />
                    <span>{project.location}</span>
                  </div>
                  <p className="font-editorial text-base text-primary font-semibold">
                    {project.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
