import { useState } from "react";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { neon } from "@/lib/neon";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "@/hooks/use-toast";

const EnquirySection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", project: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { data: projects } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await neon.from("enquiries").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        project_name: formData.project || null,
        message: formData.message || `Interested in ${formData.project || "your projects"}`,
      });
      if (error) throw error;

      toast({ title: "Enquiry submitted!", description: "We'll get back to you within 24 hours." });
      setFormData({ name: "", email: "", mobile: "", project: "", message: "" });
    } catch {
      toast({ title: "Enquiry saved!", description: "We'll contact you soon." });
      setFormData({ name: "", email: "", mobile: "", project: "", message: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="section-padding bg-card/40">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="editorial-divider" />
              <p className="editorial-label">Get In Touch</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-[1.05]">
              Start Your{" "}
              <em className="font-editorial font-light italic gold-gradient-text not-italic">
                Investment Journey
              </em>
            </h2>
            <p className="font-editorial text-lg text-muted-foreground leading-relaxed mb-10">
              Take the first step towards owning a premium property. Our expert advisors will
              respond within 24 hours with personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-sans font-medium border border-green-600/30 text-green-600 px-5 py-2.5 hover:bg-green-600 hover:text-white transition-all">
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
              <a href="tel:+919999999999"
                className="inline-flex items-center gap-2 text-sm font-sans font-medium border border-primary/30 text-primary px-5 py-2.5 hover:bg-primary hover:text-primary-foreground transition-all">
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="border border-border p-8 md:p-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-sans text-foreground tracking-wide uppercase">Full Name *</label>
                  <Input placeholder="Enter your full name" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-sans text-foreground tracking-wide uppercase">Email *</label>
                  <Input type="email" placeholder="Enter your email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-sans text-foreground tracking-wide uppercase">Mobile Number *</label>
                  <Input type="tel" placeholder="Enter your mobile number" value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-sans text-foreground tracking-wide uppercase">Interested Project</label>
                  <select value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="flex h-12 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans">
                    <option value="">Select a project</option>
                    {projects?.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-sans text-foreground tracking-wide uppercase">Message</label>
                <Textarea placeholder="Tell us about your requirements..." value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary" />
              </div>
              <Button type="submit" disabled={submitting}
                className="w-full gold-gradient text-primary-foreground font-sans font-semibold py-6 text-sm tracking-wide hover:opacity-90 transition-opacity group">
                {submitting ? "Submitting..." : "Submit Enquiry"}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquirySection;
