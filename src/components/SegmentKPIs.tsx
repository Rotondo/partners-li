import { PartnerType } from "@/types/ecosystem-partner";

interface SegmentKPIsProps {
  type: PartnerType;
  kpis: Record<string, unknown>;
}

function KPIItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-semibold font-display text-card-foreground">{value}</p>
    </div>
  );
}

function formatValue(v: unknown): string {
  if (typeof v === "number") {
    if (v > 10000) return `R$ ${(v / 1000).toFixed(0)}K`;
    if (v % 1 !== 0) return v.toFixed(1);
    return v.toString();
  }
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

const LABELS: Record<string, string> = {
  projects_delivered: "Projetos Entregues",
  avg_project_duration_days: "Duração Média (dias)",
  on_time_delivery_pct: "Entrega no Prazo (%)",
  avg_revenue_uplift_pct: "Uplift de Receita (%)",
  client_retention_pct: "Retenção de Clientes (%)",
  certifications: "Certificações",
  active_integrations: "Integrações Ativas",
  api_error_rate_pct: "Taxa de Erro API (%)",
  avg_onboarding_days: "Onboarding Médio (dias)",
  feature_adoption_pct: "Adoção de Features (%)",
  churn_rate_pct: "Churn (%)",
  mrr_from_li_stores: "MRR das Lojas LI",
  payment_approval_rate_pct: "Taxa de Aprovação (%)",
  avg_checkout_conversion_uplift_pct: "Uplift Conversão Checkout (%)",
  chargeback_rate_pct: "Chargeback (%)",
  fraud_prevention_rate_pct: "Prevenção de Fraude (%)",
  pix_adoption_pct: "Adoção PIX (%)",
  avg_installment_rate: "Parcelamento Médio",
  avg_delivery_days: "Prazo Médio (dias)",
  damage_rate_pct: "Taxa de Avarias (%)",
  return_rate_pct: "Taxa de Devolução (%)",
  sla_compliance_pct: "Compliance SLA (%)",
  coverage_states: "Cobertura (Estados)",
  avg_shipping_cost_brl: "Custo Médio Frete (R$)",
  first_contact_resolution_pct: "Resolução 1º Contato (%)",
  avg_handle_time_minutes: "Tempo Médio Atendimento (min)",
  abandonment_rate_pct: "Taxa de Abandono (%)",
  nps_score: "NPS",
  channels_covered: "Canais Cobertos",
  ai_automation_pct: "Automação IA (%)",
  projects_completed: "Projetos Concluídos",
  avg_roi_reported_pct: "ROI Médio Reportado (%)",
  client_satisfaction_score: "Satisfação do Cliente",
  specializations: "Especializações",
  stores_implemented: "Lojas Implementadas",
  avg_go_live_days: "Prazo Go-live (dias)",
  rework_rate_pct: "Retrabalho (%)",
  certified_developers: "Devs Certificados",
  stores_operated: "Lojas Operadas",
  avg_gmv_managed_brl: "GMV Médio Gerenciado",
  avg_revenue_growth_pct: "Crescimento Receita (%)",
  services_bundled: "Serviços Incluídos",
  avg_contract_duration_months: "Duração Contrato (meses)",
};

export function SegmentKPIs({ type, kpis }: SegmentKPIsProps) {
  const entries = Object.entries(kpis);
  if (entries.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-3 font-display">
        KPIs — {type}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {entries.map(([key, value]) => (
          <KPIItem key={key} label={LABELS[key] || key} value={formatValue(value)} />
        ))}
      </div>
    </div>
  );
}
