import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FolderOpen, FileText, MessageSquare, Star, Eye, TrendingUp, BarChart3, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Stats {
  projects: number;
  blogs: number;
  enquiries: number;
  unreadEnquiries: number;
  testimonials: number;
  totalVisits: number;
  todayVisits: number;
}

interface TrafficData { date: string; visits: number; }
interface PageData { path: string; visits: number; }

type Period = "daily" | "weekly" | "monthly" | "yearly";

const CHART_COLORS = [
  "hsl(33, 42%, 38%)", "hsl(30, 40%, 50%)", "hsl(25, 35%, 60%)",
  "hsl(20, 30%, 45%)", "hsl(28, 38%, 55%)", "hsl(35, 45%, 42%)",
];

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [period, setPeriod] = useState<Period>("daily");
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [projectTraffic, setProjectTraffic] = useState<PageData[]>([]);
  const [blogTraffic, setBlogTraffic] = useState<PageData[]>([]);
  const [pageTraffic, setPageTraffic] = useState<PageData[]>([]);

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
        projects: projects.count ?? 0, blogs: blogs.count ?? 0,
        enquiries: enquiries.count ?? 0, unreadEnquiries: unread.count ?? 0,
        testimonials: testimonials.count ?? 0, totalVisits: visits.count ?? 0,
        todayVisits: todayV.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchTraffic = async () => {
      const now = new Date();
      let startDate: Date;
      let groupFormat: (d: Date) => string;

      switch (period) {
        case "daily":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          groupFormat = (d) => d.toISOString().split("T")[0];
          break;
        case "weekly":
          startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);
          groupFormat = (d) => {
            const week = Math.ceil(d.getDate() / 7);
            return `W${week} ${d.toLocaleString("default", { month: "short" })}`;
          };
          break;
        case "monthly":
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
          groupFormat = (d) => d.toLocaleString("default", { month: "short", year: "2-digit" });
          break;
        case "yearly":
          startDate = new Date(now.getFullYear() - 5, 0, 1);
          groupFormat = (d) => d.getFullYear().toString();
          break;
      }

      const { data: visits } = await supabase
        .from("page_visits")
        .select("visited_at, path")
        .gte("visited_at", startDate.toISOString())
        .order("visited_at", { ascending: true });

      if (!visits) return;

      // Aggregate traffic by period
      const grouped: Record<string, number> = {};
      const projectCounts: Record<string, number> = {};
      const blogCounts: Record<string, number> = {};
      const pageCounts: Record<string, number> = {};

      visits.forEach((v) => {
        const date = new Date(v.visited_at);
        const key = groupFormat(date);
        grouped[key] = (grouped[key] || 0) + 1;

        // Categorize by path
        if (v.path.startsWith("/projects/") && v.path !== "/projects") {
          const name = v.path.replace("/projects/", "").replace(/-/g, " ");
          projectCounts[name] = (projectCounts[name] || 0) + 1;
        } else if (v.path.startsWith("/blog/") && v.path !== "/blog") {
          const name = v.path.replace("/blog/", "").replace(/-/g, " ");
          blogCounts[name] = (blogCounts[name] || 0) + 1;
        }
        pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
      });

      setTrafficData(Object.entries(grouped).map(([date, visits]) => ({ date, visits })));
      setProjectTraffic(Object.entries(projectCounts).map(([path, visits]) => ({ path, visits })).sort((a, b) => b.visits - a.visits).slice(0, 10));
      setBlogTraffic(Object.entries(blogCounts).map(([path, visits]) => ({ path, visits })).sort((a, b) => b.visits - a.visits).slice(0, 10));
      setPageTraffic(Object.entries(pageCounts).map(([path, visits]) => ({ path, visits })).sort((a, b) => b.visits - a.visits).slice(0, 10));
    };
    fetchTraffic();
  }, [period]);

  const summaryCards = stats ? [
    { label: "Projects", value: stats.projects, icon: FolderOpen },
    { label: "Blog Posts", value: stats.blogs, icon: FileText },
    { label: "Enquiries", value: stats.enquiries, sub: `${stats.unreadEnquiries} unread`, icon: MessageSquare },
    { label: "Testimonials", value: stats.testimonials, icon: Star },
    { label: "Total Visits", value: stats.totalVisits, icon: Eye },
    { label: "Today's Visits", value: stats.todayVisits, icon: TrendingUp },
  ] : [];

  const periods: { value: Period; label: string }[] = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-serif font-bold">Dashboard</h1>

      {/* Summary Cards */}
      {!stats ? (
        <p className="text-muted-foreground">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryCards.map((c) => (
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

      {/* Traffic Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-serif font-bold">Traffic Overview</h2>
          </div>
          <div className="flex gap-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 text-xs font-sans rounded-md transition-colors ${
                  period === p.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(25, 8%, 80%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(20, 5%, 50%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(20, 5%, 50%)" />
              <Tooltip
                contentStyle={{ background: "hsl(30, 12%, 91%)", border: "1px solid hsl(25, 8%, 80%)", borderRadius: "6px", fontSize: "12px" }}
              />
              <Bar dataKey="visits" fill="hsl(33, 42%, 38%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-primary" />
            <h3 className="text-base font-serif font-bold">Top Pages</h3>
          </div>
          <div className="space-y-2">
            {pageTraffic.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet</p>
            ) : pageTraffic.map((p, i) => (
              <div key={p.path} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono w-5">{i + 1}</span>
                  <span className="text-sm font-sans truncate max-w-[200px]">{p.path}</span>
                </div>
                <span className="text-sm font-semibold text-primary">{p.visits}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Projects */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="w-4 h-4 text-primary" />
            <h3 className="text-base font-serif font-bold">Top Viewed Projects</h3>
          </div>
          {projectTraffic.length === 0 ? (
            <p className="text-sm text-muted-foreground">No project views yet</p>
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={projectTraffic} cx="50%" cy="50%" outerRadius={80} dataKey="visits" nameKey="path" label={({ path, visits }) => `${path.slice(0, 12)}… (${visits})`} labelLine={false}>
                    {projectTraffic.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Blogs */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-base font-serif font-bold">Top Viewed Blogs</h3>
          </div>
          <div className="space-y-2">
            {blogTraffic.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blog views yet</p>
            ) : blogTraffic.map((b, i) => (
              <div key={b.path} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono w-5">{i + 1}</span>
                  <span className="text-sm font-sans capitalize truncate max-w-[200px]">{b.path}</span>
                </div>
                <span className="text-sm font-semibold text-primary">{b.visits}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic by Period Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-base font-serif font-bold">Period Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total visits in range</span>
              <span className="text-lg font-serif font-bold">{trafficData.reduce((s, d) => s + d.visits, 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average per {period === "daily" ? "day" : period === "weekly" ? "week" : period === "monthly" ? "month" : "year"}</span>
              <span className="text-lg font-serif font-bold">
                {trafficData.length > 0 ? Math.round(trafficData.reduce((s, d) => s + d.visits, 0) / trafficData.length) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Peak period</span>
              <span className="text-sm font-medium text-primary">
                {trafficData.length > 0 ? trafficData.reduce((max, d) => d.visits > max.visits ? d : max, trafficData[0]).date : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Unique pages viewed</span>
              <span className="text-lg font-serif font-bold">{pageTraffic.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
