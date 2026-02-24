import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { neon } from "@/lib/neon";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import Index from "./pages/Index";

// Lazy-load non-critical routes for faster initial page load
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
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

// Track page visits
const PageTracker = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    neon.from("page_visits").insert({
      path: location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
    }).then(({ error }) => {
      if (error) console.error("Failed to log visit:", error);
    });
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
    <Footer />
    <WhatsAppFloat />
  </>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
