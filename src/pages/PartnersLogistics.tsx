import { Sidebar } from "@/components/layout/Sidebar";
import { LogisticPartnersTable } from "@/components/partners/LogisticPartnersTable";

const PartnersLogistics = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          <LogisticPartnersTable />
        </div>
      </main>
    </div>
  );
};

export default PartnersLogistics;
