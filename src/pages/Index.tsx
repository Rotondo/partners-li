import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { PartnersOverview } from "@/components/partners/PartnersOverview";
import { LogisticPartnersTable } from "@/components/partners/LogisticPartnersTable";
import { PaymentPartnersTable } from "@/components/partners/PaymentPartnersTable";
import { MarketplacePartnersTable } from "@/components/partners/MarketplacePartnersTable";
import { StoresOverview } from "@/components/stores/StoresOverview";
import { FieldManager } from "@/components/admin/FieldManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "partners":
        return <PartnersOverview />;
      case "partners-logistics":
        return <LogisticPartnersTable />;
      case "partners-payment":
        return <PaymentPartnersTable />;
      case "partners-marketplace":
        return <MarketplacePartnersTable />;
      case "stores":
        return <StoresOverview />;
      case "projections":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground">Projeções</h2>
            <p className="text-muted-foreground mt-2">Em desenvolvimento</p>
          </div>
        );
      case "reports":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground">Relatórios</h2>
            <p className="text-muted-foreground mt-2">Em desenvolvimento</p>
          </div>
        );
      case "admin":
        return <FieldManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
