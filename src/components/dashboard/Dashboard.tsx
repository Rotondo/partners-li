import { DollarSign, TrendingUp, CheckCircle, XCircle, CreditCard, Activity } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Dashboard = () => {
  const metrics = [];
  const paymentMethodDistribution = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Visão geral da performance dos meios de pagamento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Nenhuma métrica disponível. Configure seus meios de pagamento para começar.</p>
          </div>
        ) : (
          metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Meio de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethodDistribution.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum dado de distribuição disponível.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethodDistribution.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.method}</span>
                    <span className="text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-foreground min-w-[120px] text-right">
                      {item.volume}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.transactions.toLocaleString('pt-BR')} transações
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
