import { useEffect, useState } from "react";
import { neon } from "@/lib/neon";
import { BarChart3, Eye, FolderOpen, FileText, TrendingUp, Calendar } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

interface TrafficData { date: string; visits: number }
interface PageData { name: string; visits: number }

type Period = "daily" | "weekly" | "monthly" | "yearly";

const CHART_COLORS = [
  "hsl(33, 42%, 38%)", "hsl(30, 40%, 50%)", "hsl(25, 35%, 60%)",
  "hsl(20, 30%, 45%)", "hsl(28, 38%, 55%)", "hsl(35, 45%, 42%)",
  "hsl(22, 28%, 52%)", "hsl(32, 36%, 46%)",
];

const PERIODS: { value: Period; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const AdminAnalytics = () => {
  const [period, setPeriod] = useState<Period>("daily");
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [projectTraffic, setProjectTraffic] = useState<PageData[]>([]);
  const [blogTraffic, setBlogTraffic] = useState<PageData[]>([]);
  const [pageTraffic, setPageTraffic] = useState<PageData[]>([]);

  // Fetch summary counts
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    Promise.all([
      neon.from("page_visits").select("id"),
      neon.from("page_visits").select("id").gte("visited_at", today),
    ]).then(([all, todayR]) => {
      setTotalVisits(all.data?.length ?? 0);
      setTodayVisits(todayR.data?.length ?? 0);
    });
  }, []);

  // Fetch traffic breakdown
  useEffect(() => {
    const fetchTraffic = async () => {
      const now = new Date();
      let startDate: Date;
      let groupFormat: (d: Date) => string;

      switch (period) {
        case "daily":
          startDate = new Date(now.getTime() - 30 * 86400000);
          groupFormat = (d) => d.toISOString().split("T")[0];
          break;
        case "weekly":
          startDate = new Date(now.getTime() - 12 * 7 * 86400000);
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

      const { data: visits } = await neon
        .from("page_visits")
        .select("visited_at, path")
        .gte("visited_at", startDate.toISOString())
        .order("visited_at", { ascending: true });

      if (!visits) return;

      const grouped: Record<string, number> = {};
      const projectCounts: Record<string, number> = {};
      const blogCounts: Record<string, number> = {};
      const pageCounts: Record<string, number> = {};

      visits.forEach((v) => {
        const date = new Date(v.visited_at);
        const key = groupFormat(date);
        grouped[key] = (grouped[key] || 0) + 1;

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
      setProjectTraffic(
        Object.entries(projectCounts)
          .map(([name, visits]) => ({ name, visits }))
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 10)
      );
      setBlogTraffic(
        Object.entries(blogCounts)
          .map(([name, visits]) => ({ name, visits }))
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 10)
      );
      setPageTraffic(
        Object.entries(pageCounts)
          .map(([name, visits]) => ({ name, visits }))
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 10)
      );
    };
    fetchTraffic();
  }, [period]);

  const totalInRange = trafficData.reduce((s, d) => s + d.visits, 0);
  const avgPerPeriod = trafficData.length > 0 ? Math.round(totalInRange / trafficData.length) : 0;
  const peakPeriod = trafficData.length > 0
    ? trafficData.reduce((max, d) => (d.visits > max.visits ? d : max), trafficData[0]).date
    : "N/A";

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-serif font-bold">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Visits", value: totalVisits, icon: Eye },
          { label: "Today's Visits", value: todayVisits, icon: TrendingUp },
          { label: "Avg per Period", value: avgPerPeriod, icon: BarChart3 },
          { label: "Unique Pages", value: pageTraffic.length, icon: Calendar },
        ].map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-lg p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-sans">{c.label}</span>
              <c.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-serif font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Traffic Overview Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-serif font-bold">Traffic Overview</h2>
          </div>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
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
          {trafficData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No traffic data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(25, 8%, 80%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(20, 5%, 50%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(20, 5%, 50%)" />
                <Tooltip contentStyle={{ background: "hsl(30, 12%, 91%)", border: "1px solid hsl(25, 8%, 80%)", borderRadius: "6px", fontSize: "12px" }} />
                <Bar dataKey="visits" fill="hsl(33, 42%, 38%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Per-Project & Per-Blog breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visits per Project */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="w-4 h-4 text-primary" />
            <h3 className="text-base font-serif font-bold">Visits per Project</h3>
          </div>
          {projectTraffic.length === 0 ? (
            <p className="text-sm text-muted-foreground">No project views yet</p>
          ) : (
            <>
              <div className="h-52 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectTraffic}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="visits"
                      nameKey="name"
                      label={({ name, visits }) => `${(name as string).slice(0, 14)}… (${visits})`}
                      labelLine={false}
                    >
                      {projectTraffic.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {projectTraffic.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-sm font-sans capitalize truncate max-w-[200px]">{p.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{p.visits}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Visits per Blog */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-base font-serif font-bold">Visits per Blog</h3>
          </div>
          {blogTraffic.length === 0 ? (
            <p className="text-sm text-muted-foreground">No blog views yet</p>
          ) : (
            <>
              <div className="h-52 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={blogTraffic}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="visits"
                      nameKey="name"
                      label={({ name, visits }) => `${(name as string).slice(0, 14)}… (${visits})`}
                      labelLine={false}
                    >
                      {blogTraffic.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {blogTraffic.map((b, i) => (
                  <div key={b.name} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-sm font-sans capitalize truncate max-w-[200px]">{b.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{b.visits}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-primary" />
          <h3 className="text-base font-serif font-bold">Top Pages</h3>
        </div>
        <div className="space-y-2">
          {pageTraffic.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : pageTraffic.map((p, i) => (
            <div key={p.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono w-5">{i + 1}</span>
                <span className="text-sm font-sans truncate max-w-[300px]">{p.name}</span>
              </div>
              <span className="text-sm font-semibold text-primary">{p.visits}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Period Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="text-base font-serif font-bold">Period Summary</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <span className="text-sm text-muted-foreground block">Total in range</span>
            <span className="text-2xl font-serif font-bold">{totalInRange}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground block">
              Avg per {period === "daily" ? "day" : period === "weekly" ? "week" : period === "monthly" ? "month" : "year"}
            </span>
            <span className="text-2xl font-serif font-bold">{avgPerPeriod}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground block">Peak period</span>
            <span className="text-lg font-medium text-primary">{peakPeriod}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
