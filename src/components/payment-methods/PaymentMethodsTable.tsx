import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { AddPaymentMethodDialog } from "./AddPaymentMethodDialog";
import { PaymentMethod, DEFAULT_PAYMENT_TYPES, PaymentType } from "@/types/payment-method";

const STATUS_VARIANTS = {
  "Ativo": "default",
  "Inativo": "secondary",
  "Em Homologação": "outline",
  "Pausado": "secondary",
  "Cancelado": "destructive",
} as const;

export const PaymentMethodsTable = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>(DEFAULT_PAYMENT_TYPES);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddPaymentMethod = (paymentMethod: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, paymentMethod]);
  };

  const getAverageApproval = (method: PaymentMethod) => {
    const avg = (
      method.performance.month1.approval +
      method.performance.month2.approval +
      method.performance.month3.approval
    ) / 3;
    return avg.toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meios de Pagamento</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os parceiros e soluções de pagamento integradas
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Meio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parceiros Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhum meio de pagamento cadastrado ainda.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Clique em "Adicionar Meio" para começar.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>MDR Créd.</TableHead>
                  <TableHead>MDR Déb.</TableHead>
                  <TableHead>MDR Pix</TableHead>
                  <TableHead>Liquidação</TableHead>
                  <TableHead>Take Rate</TableHead>
                  <TableHead>Aprovação Média</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentMethods.map((method) => (
                  <TableRow key={method.id}>
                    <TableCell className="font-medium">{method.name}</TableCell>
                    <TableCell>{method.type}</TableCell>
                    <TableCell>{method.fees.mdrCreditVista}%</TableCell>
                    <TableCell>{method.fees.mdrDebit}%</TableCell>
                    <TableCell>{method.fees.mdrPix}%</TableCell>
                    <TableCell>D+{method.settlement.credit}</TableCell>
                    <TableCell>{method.takeRate}%</TableCell>
                    <TableCell>{getAverageApproval(method)}%</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[method.status]}>
                        {method.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddPaymentMethodDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        paymentTypes={paymentTypes}
        onUpdateTypes={setPaymentTypes}
        onAdd={handleAddPaymentMethod}
      />
    </div>
  );
};
