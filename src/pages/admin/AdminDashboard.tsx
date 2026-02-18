import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FolderOpen, FileText, MessageSquare, Star, Eye } from "lucide-react";

interface Stats {
  projects: number;
  blogs: number;
  enquiries: number;
  unreadEnquiries: number;
  testimonials: number;
  totalVisits: number;
  todayVisits: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split("T")[0];
      const [projects, blogs, enquiries, unread, testimonials, visits, todayV] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("page_visits").select("id", { count: "exact", head: true }),
        supabase.from("page_visits").select("id", { count: "exact", head: true }).gte("visited_at", today),
      ]);
      setStats({
        projects: projects.count ?? 0,
        blogs: blogs.count ?? 0,
        enquiries: enquiries.count ?? 0,
        unreadEnquiries: unread.count ?? 0,
        testimonials: testimonials.count ?? 0,
        totalVisits: visits.count ?? 0,
        todayVisits: todayV.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = stats
    ? [
        { label: "Projects", value: stats.projects, icon: FolderOpen },
        { label: "Blog Posts", value: stats.blogs, icon: FileText },
        { label: "Enquiries", value: stats.enquiries, sub: `${stats.unreadEnquiries} unread`, icon: MessageSquare },
        { label: "Testimonials", value: stats.testimonials, icon: Star },
        { label: "Total Visits", value: stats.totalVisits, icon: Eye },
        { label: "Today's Visits", value: stats.todayVisits, icon: Eye },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">Dashboard</h1>
      {!stats ? (
        <p className="text-muted-foreground">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.label} className="bg-card border border-border rounded-lg p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-sans">{c.label}</span>
                <c.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-serif font-bold">{c.value}</p>
              {c.sub && <p className="text-xs text-primary">{c.sub}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
