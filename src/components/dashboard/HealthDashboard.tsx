import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface HealthMetric {
  id: string;
  partner_id: string;
  overall_score: number;
  health_status: 'excellent' | 'good' | 'warning' | 'critical';
  performance_score: number;
  engagement_score: number;
  commercial_score: number;
  days_since_last_contact: number;
  meetings_this_month: number;
  open_issues_count: number;
  calculated_at: string;
  partners: { name: string; type: string };
}

export const HealthDashboard = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const { data: healthMetrics, refetch } = useQuery({
    queryKey: ['health-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_health_metrics')
        .select(`
          *,
          partners (name, type)
        `)
        .order('overall_score', { ascending: true });

      if (error) throw error;
      return data as HealthMetric[];
    },
  });

  const { data: alerts } = useQuery({
    queryKey: ['partner-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_alerts')
        .select(`
          *,
          partners (name)
        `)
        .eq('is_resolved', false)
        .order('severity', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const calculateHealthScores = async () => {
    setIsCalculating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('calculate-health-scores', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast.success(`Health scores calculados para ${data.partners_processed} parceiros`);
      refetch();
    } catch (error) {
      console.error('Error calculating health scores:', error);
      toast.error('Erro ao calcular health scores');
    } finally {
      setIsCalculating(false);
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'good': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'critical': return 'bg-red-500/10 text-red-700 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getSeverityColor = (severity: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const criticalPartners = healthMetrics?.filter(m => m.health_status === 'critical') || [];
  const warningPartners = healthMetrics?.filter(m => m.health_status === 'warning') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Health Dashboard</h2>
          <p className="text-muted-foreground">
            Monitoramento da saúde das parcerias
          </p>
        </div>
        <Button onClick={calculateHealthScores} disabled={isCalculating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isCalculating ? 'animate-spin' : ''}`} />
          {isCalculating ? 'Calculando...' : 'Recalcular'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parceiros Críticos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalPartners.length}</div>
            <p className="text-xs text-muted-foreground">
              Necessitam atenção imediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Alerta</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningPartners.length}</div>
            <p className="text-xs text-muted-foreground">
              Requerem monitoramento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Não resolvidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthMetrics && healthMetrics.length > 0
                ? Math.round(healthMetrics.reduce((acc, m) => acc + m.overall_score, 0) / healthMetrics.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              De todos os parceiros
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {alerts && alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alertas Ativos</CardTitle>
            <CardDescription>
              Requerem sua atenção
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.slice(0, 5).map((alert: any) => (
              <div key={alert.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <span className="font-medium">{alert.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.partners?.name} • {new Date(alert.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Health Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Saúde das Parcerias</CardTitle>
          <CardDescription>
            Visão detalhada de todos os parceiros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthMetrics?.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{metric.partners.name}</span>
                    <Badge variant="outline" className={getHealthColor(metric.health_status)}>
                      {metric.health_status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Performance: {metric.performance_score}%</span>
                    <span>Engajamento: {metric.engagement_score}%</span>
                    <span>Comercial: {metric.commercial_score}%</span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{metric.days_since_last_contact} dias sem contato</span>
                    <span>{metric.meetings_this_month} reuniões este mês</span>
                    <span>{metric.open_issues_count} issues abertas</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{metric.overall_score}</div>
                  <p className="text-xs text-muted-foreground">Score Geral</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};