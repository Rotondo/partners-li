import { Sidebar } from "@/components/layout/Sidebar";
import { PaymentPartnersTable } from "@/components/partners/PaymentPartnersTable";

const PartnersPayment = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          <PaymentPartnersTable />
        </div>
      </main>
    </div>
  );
};

export default PartnersPayment;
