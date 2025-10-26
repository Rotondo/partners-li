import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { PaymentMethodsTable } from "@/components/payment-methods/PaymentMethodsTable";
import { StoresOverview } from "@/components/stores/StoresOverview";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "payment-methods":
        return <PaymentMethodsTable />;
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
