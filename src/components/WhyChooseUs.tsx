import { ShieldCheck, Scale, TrendingUp, MapPin, Users, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Premium Verified",
    description: "Every property undergoes rigorous legal and quality verification before listing.",
  },
  {
    icon: Scale,
    title: "Legal Transparency",
    description: "Complete documentation support with clear titles and RERA compliance. RERA Reg. No: RAJ/P/2019/942.",
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
    title: "Personal Advisory",
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
    <section className="section-padding">
      <div className="max-w-[1440px] mx-auto">
        {/* Editorial header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-20">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="editorial-divider" />
              <p className="editorial-label">The Difference</p>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-[1.05]">
              Why Choose{" "}
              <em className="font-editorial font-light italic gold-gradient-text not-italic">Us</em>
            </h2>
          </div>
          <div className="lg:col-span-7 lg:flex lg:items-end">
            <p className="font-editorial text-lg text-foreground/80 leading-relaxed max-w-lg">
              A decade of expertise, market intelligence, and unwavering commitment to your investment success.
            </p>
          </div>
        </div>

        {/* Features — editorial 2-column with generous spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14 lg:gap-y-16">
          {features.map((feature, i) => (
            <div key={feature.title} className="group">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground/80 font-sans leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
