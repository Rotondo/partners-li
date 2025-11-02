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
import NotFound from "./pages/NotFound";
import { useState } from "react";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <BlurProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BlurToggle />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/partners" element={<ProtectedRoute><Partners /></ProtectedRoute>} />
                <Route path="/partners/logistics" element={<ProtectedRoute><PartnersLogistics /></ProtectedRoute>} />
                <Route path="/partners/payment" element={<ProtectedRoute><PartnersPayment /></ProtectedRoute>} />
                <Route path="/partners/marketplace" element={<ProtectedRoute><PartnersMarketplace /></ProtectedRoute>} />
                <Route path="/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
                <Route path="/health" element={<ProtectedRoute><Health /></ProtectedRoute>} />
                <Route path="/stores" element={<ProtectedRoute><Stores /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/strategic" element={<ProtectedRoute><Strategic /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
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
