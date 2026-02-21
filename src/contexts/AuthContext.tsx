import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { neon } from "@/lib/neon";

interface AuthContextType {
  user: { id: string; email: string } | null;
  isAdmin: boolean;
  loading: boolean;
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

  const checkAdminRole = async (userId: string) => {
    try {
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

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const session = await neon.auth.getSession();
        if (!isMounted) return;

        if (session?.data?.user) {
          const u = session.data.user;
          setUser({ id: u.id, email: u.email });
          const admin = await checkAdminRole(u.id);
          if (isMounted) setIsAdmin(admin);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        if (isMounted) {
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Safety timeout — never stay loading forever
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn("Auth loading timeout — forcing load complete");
        setLoading(false);
      }
    }, 5000);

    initializeAuth();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
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
    await neon.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
