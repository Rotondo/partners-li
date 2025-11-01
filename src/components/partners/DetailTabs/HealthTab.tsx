import { useEffect, useState } from "react";
import { PartnerHealthMetrics } from "@/types/crm";
import { getPartnerHealthMetrics } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, TrendingUp, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

interface HealthTabProps {
  partnerId: string;
}

export const HealthTab = ({ partnerId }: HealthTabProps) => {
  const [metrics, setMetrics] = useState<PartnerHealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await getPartnerHealthMetrics(partnerId);
        setMetrics(data);
      } catch (error) {
        console.error("Error loading health metrics:", error);
        toast.error("Erro ao carregar métricas de saúde");
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [partnerId]);

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando métricas...</div>;
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Métricas de saúde ainda não calculadas</p>
          <p className="text-sm text-muted-foreground mt-2">
            As métricas serão geradas automaticamente com base nas atividades
          </p>
        </CardContent>
      </Card>
    );
  }

  const getHealthColor = (status: string) => {
    const colors = {
      excellent: "text-green-600",
      good: "text-blue-600",
      warning: "text-yellow-600",
      critical: "text-red-600",
    };
    return colors[status as keyof typeof colors] || "text-gray-600";
  };

  const getHealthLabel = (status: string) => {
    const labels = {
      excellent: "Excelente",
      good: "Boa",
      warning: "Atenção",
      critical: "Crítica",
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className={`h-5 w-5 ${getHealthColor(metrics.health_status)}`} />
            Saúde Geral: {getHealthLabel(metrics.health_status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Score Geral</span>
              <span className="font-bold text-lg">{metrics.overall_score}/100</span>
            </div>
            <Progress value={metrics.overall_score || 0} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.performance_score || 0}/100</div>
            <Progress value={metrics.performance_score || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Engajamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.engagement_score || 0}/100</div>
            <Progress value={metrics.engagement_score || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Comercial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.commercial_score || 0}/100</div>
            <Progress value={metrics.commercial_score || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Indicadores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Dias desde último contato:</span>
            <span className="font-medium">{metrics.days_since_last_contact} dias</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reuniões este mês:</span>
            <span className="font-medium">{metrics.meetings_this_month}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Issues abertos:</span>
            <span className="font-medium">{metrics.open_issues_count}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
