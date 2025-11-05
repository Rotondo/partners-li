import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BlurProvider } from "@/contexts/BlurContext";
import { BlurToggle } from "@/components/layout/BlurToggle";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Partners from "./pages/Partners";
import PartnersLogistics from "./pages/PartnersLogistics";
import PartnersPayment from "./pages/PartnersPayment";
import PartnersMarketplace from "./pages/PartnersMarketplace";
import Pipeline from "./pages/Pipeline";
import Health from "./pages/Health";
import Stores from "./pages/Stores";
import Reports from "./pages/Reports";
import Strategic from "./pages/Strategic";
import Admin from "./pages/Admin";
import { GoogleCallback } from "./pages/GoogleCallback";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import { ensureStorageBucketExists } from "./lib/storage";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  // Initialize storage bucket on app load
  useEffect(() => {
    ensureStorageBucketExists();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <BlurProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><><BlurToggle /><Index /></></ProtectedRoute>} />
                <Route path="/partners" element={<ProtectedRoute><><BlurToggle /><Partners /></></ProtectedRoute>} />
                <Route path="/partners/logistics" element={<ProtectedRoute><><BlurToggle /><PartnersLogistics /></></ProtectedRoute>} />
                <Route path="/partners/payment" element={<ProtectedRoute><><BlurToggle /><PartnersPayment /></></ProtectedRoute>} />
                <Route path="/partners/marketplace" element={<ProtectedRoute><><BlurToggle /><PartnersMarketplace /></></ProtectedRoute>} />
                <Route path="/pipeline" element={<ProtectedRoute><><BlurToggle /><Pipeline /></></ProtectedRoute>} />
                <Route path="/health" element={<ProtectedRoute><><BlurToggle /><Health /></></ProtectedRoute>} />
                <Route path="/stores" element={<ProtectedRoute><><BlurToggle /><Stores /></></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><><BlurToggle /><Reports /></></ProtectedRoute>} />
                <Route path="/strategic" element={<ProtectedRoute><><BlurToggle /><Strategic /></></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><><BlurToggle /><Admin /></></ProtectedRoute>} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BlurProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
