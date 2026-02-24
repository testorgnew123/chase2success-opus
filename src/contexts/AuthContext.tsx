import { useState, useEffect, createContext, useContext, type ReactNode } from "react";

// Dynamic import keeps the Neon SDK out of the main bundle.
// Auth is only needed on /admin routes, so public visitors never pay this cost.
const getNeon = () => import("@/lib/neon").then((m) => m.neon);

interface AuthContextType {
  user: { id: string; email: string } | null;
  isAdmin: boolean;
  loading: boolean;
  initializeAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const checkAdminRole = async (userId: string) => {
    try {
      const neon = await getNeon();
      const { data, error } = await neon
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin");
      if (error) throw error;
      return data && data.length > 0;
    } catch {
      return false;
    }
  };

  // Only initialize auth when explicitly triggered (by admin pages)
  const initializeAuth = async () => {
    if (initialized) return;
    setInitialized(true);
    try {
      const neon = await getNeon();
      const session = await neon.auth.getSession();
      if (session?.data?.user) {
        const u = session.data.user;
        setUser({ id: u.id, email: u.email });
        const admin = await checkAdminRole(u.id);
        setIsAdmin(admin);
      }
    } catch (err) {
      console.error("Auth init error:", err);
    } finally {
      setLoading(false);
    }
  };

  // On public pages, mark loading as false immediately (no auth needed)
  useEffect(() => {
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    if (isAdminRoute) {
      initializeAuth();
    } else {
      // Public pages don't need auth — resolve immediately
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const neon = await getNeon();
      const result = await neon.auth.signIn.email({ email, password });
      if (result.error) {
        return { error: result.error.message || "Sign in failed" };
      }
      if (result.data?.user) {
        const u = result.data.user;
        setUser({ id: u.id, email: u.email });
        const admin = await checkAdminRole(u.id);
        setIsAdmin(admin);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || "Sign in failed" };
    }
  };

  const signOut = async () => {
    const neon = await getNeon();
    await neon.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, initializeAuth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
