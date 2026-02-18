import { useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projects } from "@/data/projects";

const EnquirySection = () => {
  const [formData, setFormData] = useState({ name: "", mobile: "", project: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hi, I'm ${formData.name}. I'm interested in ${formData.project || "your projects"}. Please contact me at ${formData.mobile}.`;
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section id="enquiry" className="section-padding max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-sans">Get In Touch</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Start Your <span className="gold-gradient-text">Investment Journey</span>
          </h2>
          <p className="text-muted-foreground font-sans mb-8 leading-relaxed">
            Take the first step towards owning a premium property. Fill out the form and our
            expert advisors will get back to you within 24 hours with personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-green-600 text-green-500 hover:bg-green-600 hover:text-white w-full sm:w-auto">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Us
              </Button>
            </a>
            <a href="tel:+919999999999">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-sans text-foreground">Full Name</label>
            <Input
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-sans text-foreground">Mobile Number</label>
            <Input
              type="tel"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              required
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-sans text-foreground">Interested Project</label>
            <select
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full gold-gradient text-primary-foreground font-semibold py-6 text-base hover:opacity-90 transition-opacity">
            Submit Enquiry
          </Button>
        </form>
      </div>
    </section>
  );
};

export default EnquirySection;
