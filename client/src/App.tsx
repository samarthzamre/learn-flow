import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Explore = lazy(() => import("./pages/Explore"));
const TopicDetail = lazy(() => import("./pages/TopicDetail"));
const Trending = lazy(() => import("./pages/Trending"));
const Categories = lazy(() => import("./pages/Categories"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Legal = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ScrollToTop = lazy(() => import("./components/layout/ScrollToTop"));

const queryClient = new QueryClient();

import { SettingsProvider, useSettings } from "@/contexts/SettingsContext";
import Maintenance from "@/pages/Maintenance";
import { Analytics } from "@/components/Analytics";

const MaintenanceWrapper = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useSettings();

  if (settings?.maintenanceMode === "true") {
    return <Maintenance />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <Analytics />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter>
            <ScrollToTop />
            <MaintenanceWrapper>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                  <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/topic/:id" element={<TopicDetail />} />
                  <Route path="/trending" element={<Trending />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Legal />} />
                  <Route path="/terms" element={<Legal />} />
                  <Route path="/cookies" element={<Legal />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </MaintenanceWrapper>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
