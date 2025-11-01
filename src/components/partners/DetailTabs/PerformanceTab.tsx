import { Partner } from "@/types/partner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, BarChart3 } from "lucide-react";

interface PerformanceTabProps {
  partner: Partner;
}

export const PerformanceTab = ({ partner }: PerformanceTabProps) => {
  if (!partner.payment || !partner.payment.performance) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Dados de performance não disponíveis</p>
          <p className="text-sm text-muted-foreground mt-2">
            Adicione informações de performance para visualizar métricas
          </p>
        </CardContent>
      </Card>
    );
  }

  const { performance } = partner.payment;
  const months = [
    { key: "month1", label: "Mês 1" },
    { key: "month2", label: "Mês 2" },
    { key: "month3", label: "Mês 3" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Performance (Últimos 3 Meses)</h3>

      {months.map(({ key, label }) => {
        const data = performance[key as keyof typeof performance];
        if (!data) return null;

        return (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-base">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>Taxa de Aprovação</span>
                  </div>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {data.approval}%
                    {data.approval > 85 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>GMV</span>
                  </div>
                  <p className="text-2xl font-bold">
                    R$ {data.gmv.toLocaleString("pt-BR")}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    <span>Transações</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {data.transactions.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxa Média de Aprovação:</span>
            <span className="font-medium">
              {(
                (performance.month1.approval +
                  performance.month2.approval +
                  performance.month3.approval) / 3
              ).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">GMV Total:</span>
            <span className="font-medium">
              R${" "}
              {(
                performance.month1.gmv +
                performance.month2.gmv +
                performance.month3.gmv
              ).toLocaleString("pt-BR")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total de Transações:</span>
            <span className="font-medium">
              {(
                performance.month1.transactions +
                performance.month2.transactions +
                performance.month3.transactions
              ).toLocaleString("pt-BR")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
