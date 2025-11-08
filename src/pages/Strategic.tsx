import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenuButton } from "@/components/layout/MobileMenuButton";
import { StrategicDashboard } from "@/components/strategic/StrategicDashboard";
import { Target } from "lucide-react";

// Mock data - substituir por dados reais do banco posteriormente
const mockPartners = [];
const mockStores = [];
const mockStoreMetrics = [];

const Strategic = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <MobileMenuButton 
        onClick={() => setMobileMenuOpen(true)} 
        isOpen={mobileMenuOpen} 
      />
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto pl-0 md:pl-0">
        <div className="container mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Target className="h-8 w-8" />
              Análise Estratégica de Parceiros
            </h1>
            <p className="text-muted-foreground mt-2">
              Quadrante de Gartner: avalie fit e rebate dos parceiros
            </p>
          </div>

          <StrategicDashboard
            partners={mockPartners}
            stores={mockStores}
            storeMetrics={mockStoreMetrics}
          />
        </div>
      </main>
    </div>
  );
};

export default Strategic;
