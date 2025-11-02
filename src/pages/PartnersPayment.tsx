import { Sidebar } from "@/components/layout/Sidebar";
import { PaymentMethodsTable } from "@/components/payment-methods/PaymentMethodsTable";

const PartnersPayment = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          <PaymentMethodsTable />
        </div>
      </main>
    </div>
  );
};

export default PartnersPayment;
