import { Sidebar } from "@/components/layout/Sidebar";
import { MarketplacePartnersTable } from "@/components/partners/MarketplacePartnersTable";

const PartnersMarketplace = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          <MarketplacePartnersTable />
        </div>
      </main>
    </div>
  );
};

export default PartnersMarketplace;
