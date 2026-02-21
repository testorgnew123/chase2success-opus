import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdminRole = async () => {
      try {
        const { data, error } = await supabase.rpc("is_admin");
        if (error) throw error;
        if (isMounted) setIsAdmin(!!data);
      } catch {
        if (isMounted) setIsAdmin(false);
      }
    };

    // Listener for ONGOING auth changes — never await inside, never control loading
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        setSession(session);
        if (session) {
          setTimeout(() => checkAdminRole(), 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // INITIAL load — controls loading state
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!isMounted) return;
        if (error) {
          console.error("Auth init error:", error);
          setSession(null);
          setIsAdmin(false);
          return;
        }
        setSession(session);
        if (session) {
          await checkAdminRole();
        }
      } catch (err) {
        console.error("Auth init exception:", err);
        if (isMounted) {
          setSession(null);
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
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    // Admin check will happen via onAuthStateChange
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
