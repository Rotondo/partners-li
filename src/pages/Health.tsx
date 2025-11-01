import { Sidebar } from "@/components/layout/Sidebar";
import { HealthDashboard } from "@/components/dashboard/HealthDashboard";
import { useState } from "react";

const Health = () => {
  const [activeTab, setActiveTab] = useState("health");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          <HealthDashboard />
        </div>
      </main>
    </div>
  );
};

export default Health;