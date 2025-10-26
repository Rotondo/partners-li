import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const paymentMethods = [
  {
    name: "Stripe",
    type: "Gateway",
    mdrCredit: "2.9%",
    mdrDebit: "1.9%",
    mdrPix: "0.99%",
    settlement: "D+2",
    takeRate: "1.5%",
    approvalRate: "96.2%",
    status: "Ativo"
  },
  {
    name: "Mercado Pago",
    type: "Subadquirente",
    mdrCredit: "3.79%",
    mdrDebit: "2.39%",
    mdrPix: "0.99%",
    settlement: "D+14",
    takeRate: "1.2%",
    approvalRate: "94.8%",
    status: "Ativo"
  },
  {
    name: "PagSeguro",
    type: "PSP",
    mdrCredit: "3.99%",
    mdrDebit: "2.99%",
    mdrPix: "1.99%",
    settlement: "D+30",
    takeRate: "1.8%",
    approvalRate: "92.1%",
    status: "Ativo"
  },
  {
    name: "Cielo",
    type: "Adquirente",
    mdrCredit: "2.5%",
    mdrDebit: "1.5%",
    mdrPix: "N/A",
    settlement: "D+1",
    takeRate: "1.0%",
    approvalRate: "97.5%",
    status: "Em teste"
  }
];

export const PaymentMethodsTable = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Meios de Pagamento</h2>
          <p className="text-muted-foreground mt-1">Gerencie seus parceiros de pagamento</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Meio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parceiros Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Parceiro</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">MDR Crédito</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">MDR Débito</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">MDR Pix</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Prazo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Take Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Aprovação</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethods.map((method, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-foreground">{method.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary">{method.type}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">{method.mdrCredit}</td>
                    <td className="py-4 px-4 text-sm text-foreground">{method.mdrDebit}</td>
                    <td className="py-4 px-4 text-sm text-foreground">{method.mdrPix}</td>
                    <td className="py-4 px-4 text-sm text-foreground">{method.settlement}</td>
                    <td className="py-4 px-4 text-sm font-medium text-accent">{method.takeRate}</td>
                    <td className="py-4 px-4 text-sm font-medium text-success">{method.approvalRate}</td>
                    <td className="py-4 px-4">
                      <Badge variant={method.status === "Ativo" ? "default" : "outline"}>
                        {method.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
