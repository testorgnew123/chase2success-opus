import { ShieldCheck, Scale, TrendingUp, MapPin, Users, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Premium Verified Properties",
    description: "Every property undergoes rigorous legal and quality verification before listing.",
  },
  {
    icon: Scale,
    title: "Legal Transparency",
    description: "Complete documentation support with clear titles and RERA compliance.",
  },
  {
    icon: TrendingUp,
    title: "High ROI Potential",
    description: "Strategically selected locations with proven appreciation trajectories.",
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    description: "Properties in the most sought-after corridors and growth zones.",
  },
  {
    icon: Users,
    title: "Personalized Consultation",
    description: "Dedicated advisors who understand your investment goals and preferences.",
  },
  {
    icon: HeartHandshake,
    title: "End-to-End Support",
    description: "From site visits to registration, we handle every step of your journey.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-sans">
            The CHASE2SUCCESS Difference
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Why <span className="gold-gradient-text">Choose Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-8 bg-card border border-border rounded-lg transition-all duration-500 hover:border-primary/50 hover:gold-glow text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full gold-gradient mb-6">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-serif font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-sans">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
