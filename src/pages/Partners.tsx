import { Sidebar } from "@/components/layout/Sidebar";
import { PartnersOverview } from "@/components/partners/PartnersOverview";

const Partners = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          <PartnersOverview />
        </div>
      </main>
    </div>
  );
};

export default Partners;
