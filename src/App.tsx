import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";

// Lazy-load below-fold / non-critical shell components
const Footer = lazy(() => import("./components/Footer"));
const WhatsAppFloat = lazy(() => import("./components/WhatsAppFloat"));

// Lazy-load non-critical routes for faster initial page load.
// Each import() factory is stored so it can be called early on hover (prefetch).
const routeImports = {
  projects: () => import("./pages/ProjectsPage"),
  projectDetail: () => import("./pages/ProjectDetail"),
  blog: () => import("./pages/BlogPage"),
  blogDetail: () => import("./pages/BlogDetail"),
  contact: () => import("./pages/ContactPage"),
  about: () => import("./pages/AboutPage"),
} as const;

const ProjectsPage = lazy(routeImports.projects);
const ProjectDetail = lazy(routeImports.projectDetail);
const BlogPage = lazy(routeImports.blog);
const BlogDetail = lazy(routeImports.blogDetail);
const ContactPage = lazy(routeImports.contact);
const AboutPage = lazy(routeImports.about);
const NotFound = lazy(() => import("./pages/NotFound"));

// Map nav paths → prefetch functions. Called on hover for instant navigation.
const prefetchMap: Record<string, (() => Promise<unknown>) | undefined> = {
  "/projects": routeImports.projects,
  "/blog": routeImports.blog,
  "/contact": routeImports.contact,
  "/about": routeImports.about,
};

/**
 * Prefetch a route's JS chunk on hover so navigation feels instant.
 * Attach to anchor/Link elements: onMouseEnter={() => prefetchRoute("/projects")}
 */
export const prefetchRoute = (path: string) => {
  const loader = prefetchMap[path];
  if (loader) loader();
};
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminBlogs = lazy(() => import("./pages/admin/AdminBlogs"));
const AdminEnquiries = lazy(() => import("./pages/admin/AdminEnquiries"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes — avoid refetching on every mount
      gcTime: 10 * 60 * 1000,     // 10 minutes cache
    },
  },
});

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Track page visits — deferred so it doesn't block initial render.
// Uses dynamic import() so the Neon SDK stays out of the main bundle.
const PageTracker = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    const schedule = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1000));
    const id = schedule(() => {
      import("@/lib/neon").then(({ neon }) => {
        neon.from("page_visits").insert({
          path: location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent || null,
        }).then(({ error }: { error: unknown }) => {
          if (error) console.error("Failed to log visit:", error);
        });
      });
    });
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
    };
  }, [location.pathname]);
  return null;
};

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
    <Suspense fallback={null}>
      <Footer />
      <WhatsAppFloat />
    </Suspense>
  </>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <PageTracker />
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="blogs" element={<AdminBlogs />} />
                  <Route path="enquiries" element={<AdminEnquiries />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                </Route>
                <Route path="/*" element={<PublicLayout />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
