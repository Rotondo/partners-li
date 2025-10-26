import { DollarSign, TrendingUp, CheckCircle, XCircle, CreditCard, Activity } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Dashboard = () => {
  const metrics = [
    {
      title: "Volume Total Processado",
      value: "R$ 2.457.890",
      change: "+12,5% vs mês anterior",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "text-primary"
    },
    {
      title: "Receita da Plataforma",
      value: "R$ 48.156",
      change: "+8,3% vs mês anterior",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "text-accent"
    },
    {
      title: "Taxa de Aprovação",
      value: "94.2%",
      change: "+2,1% vs mês anterior",
      changeType: "positive" as const,
      icon: CheckCircle,
      iconColor: "text-success"
    },
    {
      title: "Taxa de Rejeição",
      value: "5.8%",
      change: "-1,3% vs mês anterior",
      changeType: "positive" as const,
      icon: XCircle,
      iconColor: "text-destructive"
    },
    {
      title: "Número de Transações",
      value: "15.847",
      change: "+18,7% vs mês anterior",
      changeType: "positive" as const,
      icon: Activity,
      iconColor: "text-primary"
    },
    {
      title: "Ticket Médio",
      value: "R$ 155,07",
      change: "-4,2% vs mês anterior",
      changeType: "negative" as const,
      icon: CreditCard,
      iconColor: "text-warning"
    }
  ];

  const paymentMethodDistribution = [
    { method: "Cartão de Crédito", volume: "R$ 1.847.418", percentage: 75.2, transactions: 11234 },
    { method: "Pix", volume: "R$ 368.684", percentage: 15.0, transactions: 2847 },
    { method: "Cartão de Débito", volume: "R$ 196.631", percentage: 8.0, transactions: 1456 },
    { method: "Boleto", volume: "R$ 45.157", percentage: 1.8, transactions: 310 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Visão geral da performance dos meios de pagamento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Meio de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};
