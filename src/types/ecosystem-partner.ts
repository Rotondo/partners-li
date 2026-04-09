export type PartnerType =
  | "SaaS"
  | "Agência"
  | "Consultoria"
  | "Implementadora"
  | "Integradora"
  | "Operador Logístico"
  | "Fintech"
  | "BPO"
  | "Full Commerce"
  | "Lawtech"
  | "Data/AI Provider";

export type PartnerStatus = "Ativo" | "Inativo" | "Em análise";
export type BusinessModel = "D2C" | "B2C" | "B2B" | "Marketplace" | "Omnichannel";
export type StoreSize = "Pequeno" | "Médio" | "Grande" | "Enterprise";
export type RevenueRecurrence = "Recorrente" | "Projeto" | "Híbrido";
export type ImplementationComplexity = "Baixa" | "Média" | "Alta";

export const JOURNEY_STAGES = [
  "Estratégia e Planejamento",
  "Criação da Loja / Tecnologia",
  "Catálogo e Conteúdo",
  "Aquisição de Clientes / Marketing",
  "Conversão e Experiência",
  "Pagamentos e Segurança",
  "Operação e Gestão",
  "Logística e Entrega",
  "Atendimento e Pós-venda",
  "Retenção e Expansão",
  "Dados e BI (Transversal)",
  "Segurança e Compliance (Transversal)",
  "Marketplaces e Omnichannel (Transversal)",
] as const;

export type JourneyStage = (typeof JOURNEY_STAGES)[number];

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  type: PartnerType;
  macro_categories: JourneyStage[];
  subcategories: string[];
  business_models_served: BusinessModel[];
  store_sizes_served: StoreSize[];
  revenue_recurrence: RevenueRecurrence;
  implementation_complexity: ImplementationComplexity;
  average_ticket_range: string;
  status: PartnerStatus;
  since: string;
  contact_email: string;
  website: string;
}

export interface PartnerKPI {
  partner_id: string;
  period: string;
  stores_using: number;
  stores_churned: number;
  stores_new: number;
  nps_score: number;
  csat_score: number;
  support_tickets_open: number;
  support_avg_resolution_hours: number;
  integration_uptime_pct: number;
  revenue_influenced: number;
  segment_specific_kpis: Record<string, unknown>;
}

export const PARTNER_TYPE_COLORS: Record<PartnerType, string> = {
  SaaS: "#6366f1",
  Agência: "#f59e0b",
  Consultoria: "#8b5cf6",
  Implementadora: "#06b6d4",
  Integradora: "#ec4899",
  "Operador Logístico": "#14b8a6",
  Fintech: "#00C07F",
  BPO: "#f97316",
  "Full Commerce": "#3b82f6",
  Lawtech: "#a855f7",
  "Data/AI Provider": "#22d3ee",
};
