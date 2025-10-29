import { useState, useEffect } from "react";
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
import { PaymentMethod } from "@/types/payment-method";
import { getAllPaymentMethods, savePaymentMethod } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

const STATUS_VARIANTS = {
  "Ativo": "default",
  "Inativo": "secondary",
  "Em Homologação": "outline",
  "Pausado": "secondary",
  "Cancelado": "destructive",
} as const;

export const PaymentMethodsTable = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getAllPaymentMethods()
      .then(methods => {
        setPaymentMethods(methods);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading payment methods:', error);
        toast({
          title: "Erro ao carregar métodos de pagamento",
          description: "Não foi possível carregar os dados.",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, []);

  const handleAddPaymentMethod = async (paymentMethod: PaymentMethod) => {
    try {
      await savePaymentMethod(paymentMethod);
      const updated = await getAllPaymentMethods();
      setPaymentMethods(updated);
      toast({
        title: "Método adicionado com sucesso",
        description: "O método de pagamento foi salvo.",
      });
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast({
        title: "Erro ao salvar método",
        description: "Não foi possível salvar o método de pagamento.",
        variant: "destructive",
      });
    }
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
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Carregando métodos de pagamento...
              </p>
            </div>
          ) : paymentMethods.length === 0 ? (
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
                    <TableCell className="font-medium">{method.company.tradeName}</TableCell>
                    <TableCell>{method.company.solutionType}</TableCell>
                    <TableCell>{method.creditCard.feesByRevenue[0]?.baseRate || 0}%</TableCell>
                    <TableCell>{method.debitCard.baseRate}%</TableCell>
                    <TableCell>{method.pix.baseRate}%</TableCell>
                    <TableCell>D+{method.settlement.creditCardDefault}</TableCell>
                    <TableCell>{method.platformSplit.takeRatePercentage || 0}%</TableCell>
                    <TableCell>{method.performance?.approvalRates[0]?.averageRate || 0}%</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[method.status] || "default"}>
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
        onAdd={handleAddPaymentMethod}
      />
    </div>
  );
};
