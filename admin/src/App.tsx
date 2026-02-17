import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTopics from "./pages/admin/AdminTopics";
import EditTopic from "./pages/admin/EditTopic";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminResearch from "./pages/admin/AdminResearch";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root path shows Dashboard */}
          <Route path="/" element={<AdminDashboard />} />

          {/* Admin routes - both with and without /admin prefix */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/topics" element={<AdminTopics />} />
          <Route path="/admin/topics/new" element={<EditTopic />} />
          <Route path="/admin/topics/:id/edit" element={<EditTopic />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/research" element={<AdminResearch />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Non-prefixed routes (mirror of admin routes) */}
          <Route path="/topics" element={<AdminTopics />} />
          <Route path="/categories" element={<AdminCategories />} />
          <Route path="/analytics" element={<AdminAnalytics />} />
          <Route path="/research" element={<AdminResearch />} />
          <Route path="/settings" element={<AdminSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
