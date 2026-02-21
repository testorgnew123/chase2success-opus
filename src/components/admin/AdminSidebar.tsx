import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderOpen, FileText, MessageSquare, Star, LogOut, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/projects", icon: FolderOpen, label: "Projects" },
  { to: "/admin/blogs", icon: FileText, label: "Blog Posts" },
  { to: "/admin/enquiries", icon: MessageSquare, label: "Enquiries" },
  { to: "/admin/testimonials", icon: Star, label: "Testimonials" },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <aside className="w-60 border-r border-border bg-card flex flex-col shrink-0 min-h-screen">
      <div className="p-6 border-b border-border">
        <h2 className="font-serif font-bold text-lg">C2S Admin</h2>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-sans transition-colors ${
                isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
