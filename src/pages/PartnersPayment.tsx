import { Sidebar } from "@/components/layout/Sidebar";
import { PaymentPartnersTable } from "@/components/partners/PaymentPartnersTable";
import { PaymentMethodsTable } from "@/components/payment-methods/PaymentMethodsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PartnersPayment = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          <Tabs defaultValue="granular" className="space-y-6">
            <TabsList>
              <TabsTrigger value="granular">Detalhado</TabsTrigger>
              <TabsTrigger value="simplified">Resumo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="granular" className="space-y-6">
              <PaymentMethodsTable />
            </TabsContent>
            
            <TabsContent value="simplified" className="space-y-6">
              <PaymentPartnersTable />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default PartnersPayment;
