import { Partner, PartnerKPI } from "@/types/partner";

export const mockPartners: Partner[] = [
  {
    id: "1", name: "AgênciaBR Performance", logo_url: "", type: "Agência",
    macro_categories: ["Aquisição de Clientes / Marketing"],
    subcategories: ["SEO", "Google Ads", "Meta Ads"],
    business_models_served: ["D2C", "B2C"], store_sizes_served: ["Pequeno", "Médio"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Baixa",
    average_ticket_range: "R$ 2.000 - R$ 8.000", status: "Ativo", since: "2021-03-15",
    contact_email: "contato@agenciabr.com", website: "https://agenciabr.com",
  },
  {
    id: "2", name: "FreteRápido", logo_url: "", type: "Operador Logístico",
    macro_categories: ["Logística e Entrega"],
    subcategories: ["Fulfillment", "Last-mile"],
    business_models_served: ["D2C", "B2C", "Marketplace"], store_sizes_served: ["Médio", "Grande"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Média",
    average_ticket_range: "R$ 5.000 - R$ 25.000", status: "Ativo", since: "2020-06-01",
    contact_email: "parceiros@freterapido.com", website: "https://freterapido.com",
  },
  {
    id: "3", name: "PagFácil", logo_url: "", type: "Fintech",
    macro_categories: ["Pagamentos e Segurança"],
    subcategories: ["Gateway de Pagamento", "Antifraude"],
    business_models_served: ["D2C", "B2C", "B2B"], store_sizes_served: ["Pequeno", "Médio", "Grande"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Média",
    average_ticket_range: "R$ 1.500 - R$ 10.000", status: "Ativo", since: "2019-11-20",
    contact_email: "integracoes@pagfacil.com", website: "https://pagfacil.com",
  },
  {
    id: "4", name: "OmniSAC", logo_url: "", type: "BPO",
    macro_categories: ["Atendimento e Pós-venda"],
    subcategories: ["SAC", "Chatbot", "Ouvidoria"],
    business_models_served: ["D2C", "B2C"], store_sizes_served: ["Médio", "Grande", "Enterprise"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Média",
    average_ticket_range: "R$ 8.000 - R$ 30.000", status: "Ativo", since: "2022-01-10",
    contact_email: "comercial@omnisac.com", website: "https://omnisac.com",
  },
  {
    id: "5", name: "CRM Plus", logo_url: "", type: "SaaS",
    macro_categories: ["Retenção e Expansão"],
    subcategories: ["CRM", "Automação de Marketing", "Email Marketing"],
    business_models_served: ["D2C", "B2C", "B2B"], store_sizes_served: ["Pequeno", "Médio", "Grande"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Baixa",
    average_ticket_range: "R$ 500 - R$ 5.000", status: "Ativo", since: "2020-09-01",
    contact_email: "sales@crmplus.com", website: "https://crmplus.com",
  },
  {
    id: "6", name: "DataLayer BI", logo_url: "", type: "Data/AI Provider",
    macro_categories: ["Dados e BI (Transversal)"],
    subcategories: ["BI", "Data Analytics", "Machine Learning"],
    business_models_served: ["D2C", "B2C", "B2B", "Marketplace"], store_sizes_served: ["Grande", "Enterprise"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Alta",
    average_ticket_range: "R$ 10.000 - R$ 50.000", status: "Ativo", since: "2021-07-15",
    contact_email: "contato@datalayer.com", website: "https://datalayer.com",
  },
  {
    id: "7", name: "ImpleTech", logo_url: "", type: "Implementadora",
    macro_categories: ["Criação da Loja / Tecnologia"],
    subcategories: ["Implementação", "Customização", "Migração"],
    business_models_served: ["D2C", "B2C"], store_sizes_served: ["Médio", "Grande"],
    revenue_recurrence: "Projeto", implementation_complexity: "Alta",
    average_ticket_range: "R$ 15.000 - R$ 80.000", status: "Ativo", since: "2019-04-20",
    contact_email: "projetos@impletech.com", website: "https://impletech.com",
  },
  {
    id: "8", name: "FullOps Commerce", logo_url: "", type: "Full Commerce",
    macro_categories: ["Estratégia e Planejamento", "Operação e Gestão", "Logística e Entrega"],
    subcategories: ["Full Commerce", "Gestão de Marketplace", "Operação"],
    business_models_served: ["D2C", "B2C", "Marketplace", "Omnichannel"], store_sizes_served: ["Grande", "Enterprise"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Alta",
    average_ticket_range: "R$ 20.000 - R$ 100.000", status: "Ativo", since: "2020-02-01",
    contact_email: "parceria@fullops.com", website: "https://fullops.com",
  },
  {
    id: "9", name: "ConvertMax", logo_url: "", type: "SaaS",
    macro_categories: ["Conversão e Experiência"],
    subcategories: ["A/B Testing", "Personalização", "Pop-ups"],
    business_models_served: ["D2C", "B2C"], store_sizes_served: ["Pequeno", "Médio", "Grande"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Baixa",
    average_ticket_range: "R$ 300 - R$ 3.000", status: "Ativo", since: "2022-05-10",
    contact_email: "hello@convertmax.io", website: "https://convertmax.io",
  },
  {
    id: "10", name: "LegalShield BR", logo_url: "", type: "Lawtech",
    macro_categories: ["Segurança e Compliance (Transversal)"],
    subcategories: ["LGPD", "Compliance", "Contratos Digitais"],
    business_models_served: ["D2C", "B2C", "B2B"], store_sizes_served: ["Médio", "Grande", "Enterprise"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Média",
    average_ticket_range: "R$ 3.000 - R$ 15.000", status: "Ativo", since: "2023-01-20",
    contact_email: "contato@legalshield.com.br", website: "https://legalshield.com.br",
  },
  {
    id: "11", name: "EstratégicaDigital", logo_url: "", type: "Consultoria",
    macro_categories: ["Estratégia e Planejamento"],
    subcategories: ["Consultoria Estratégica", "Go-to-Market", "Pricing"],
    business_models_served: ["D2C", "B2C", "B2B"], store_sizes_served: ["Grande", "Enterprise"],
    revenue_recurrence: "Projeto", implementation_complexity: "Alta",
    average_ticket_range: "R$ 25.000 - R$ 120.000", status: "Ativo", since: "2021-11-01",
    contact_email: "contato@estrategicadigital.com", website: "https://estrategicadigital.com",
  },
  {
    id: "12", name: "CatalogoAI", logo_url: "", type: "SaaS",
    macro_categories: ["Catálogo e Conteúdo"],
    subcategories: ["Gestão de Catálogo", "Fotos de Produto", "Descrições com IA"],
    business_models_served: ["D2C", "B2C", "Marketplace"], store_sizes_served: ["Pequeno", "Médio"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Baixa",
    average_ticket_range: "R$ 200 - R$ 2.000", status: "Ativo", since: "2023-03-01",
    contact_email: "suporte@catalogoai.com", website: "https://catalogoai.com",
  },
  {
    id: "13", name: "MarketConnect", logo_url: "", type: "Integradora",
    macro_categories: ["Marketplaces e Omnichannel (Transversal)"],
    subcategories: ["Integração Marketplace", "ERP", "Hub de Integração"],
    business_models_served: ["D2C", "Marketplace", "Omnichannel"], store_sizes_served: ["Médio", "Grande"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Média",
    average_ticket_range: "R$ 2.000 - R$ 12.000", status: "Ativo", since: "2020-08-15",
    contact_email: "integracoes@marketconnect.com", website: "https://marketconnect.com",
  },
  {
    id: "14", name: "SecurePay", logo_url: "", type: "Fintech",
    macro_categories: ["Pagamentos e Segurança"],
    subcategories: ["Antifraude", "Análise de Risco"],
    business_models_served: ["D2C", "B2C", "B2B"], store_sizes_served: ["Grande", "Enterprise"],
    revenue_recurrence: "Recorrente", implementation_complexity: "Alta",
    average_ticket_range: "R$ 8.000 - R$ 40.000", status: "Em análise", since: "2024-01-10",
    contact_email: "partnerships@securepay.com", website: "https://securepay.com",
  },
  {
    id: "15", name: "GrowthAgency", logo_url: "", type: "Agência",
    macro_categories: ["Aquisição de Clientes / Marketing", "Conversão e Experiência"],
    subcategories: ["Growth Hacking", "CRO", "Mídia Paga"],
    business_models_served: ["D2C", "B2C"], store_sizes_served: ["Pequeno", "Médio"],
    revenue_recurrence: "Híbrido", implementation_complexity: "Média",
    average_ticket_range: "R$ 5.000 - R$ 20.000", status: "Inativo", since: "2021-06-01",
    contact_email: "contato@growthagency.com", website: "https://growthagency.com",
  },
];

function generateKPIs(partnerId: string, type: string): PartnerKPI[] {
  const months = ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06"];
  return months.map((period, i) => {
    const base: PartnerKPI = {
      partner_id: partnerId,
      period,
      stores_using: 50 + i * 8 + Math.floor(Math.random() * 20),
      stores_churned: Math.floor(Math.random() * 5),
      stores_new: 5 + Math.floor(Math.random() * 15),
      nps_score: 60 + Math.random() * 35,
      csat_score: 70 + Math.random() * 25,
      support_tickets_open: Math.floor(Math.random() * 20),
      support_avg_resolution_hours: 2 + Math.random() * 22,
      integration_uptime_pct: 97 + Math.random() * 3,
      revenue_influenced: 50000 + Math.random() * 200000,
      segment_specific_kpis: getSegmentKPIs(type),
    };
    return base;
  });
}

function getSegmentKPIs(type: string): Record<string, unknown> {
  switch (type) {
    case "Agência":
      return {
        projects_delivered: Math.floor(5 + Math.random() * 20),
        avg_project_duration_days: 15 + Math.random() * 45,
        on_time_delivery_pct: 75 + Math.random() * 25,
        avg_revenue_uplift_pct: 10 + Math.random() * 40,
        client_retention_pct: 70 + Math.random() * 28,
        certifications: ["Google Partner", "Meta Business Partner"],
      };
    case "SaaS":
      return {
        active_integrations: Math.floor(20 + Math.random() * 100),
        api_error_rate_pct: Math.random() * 3,
        avg_onboarding_days: 1 + Math.random() * 10,
        feature_adoption_pct: 40 + Math.random() * 50,
        churn_rate_pct: Math.random() * 8,
        mrr_from_li_stores: 5000 + Math.random() * 50000,
      };
    case "Fintech":
      return {
        payment_approval_rate_pct: 90 + Math.random() * 9,
        avg_checkout_conversion_uplift_pct: 5 + Math.random() * 20,
        chargeback_rate_pct: Math.random() * 2,
        fraud_prevention_rate_pct: 95 + Math.random() * 5,
        pix_adoption_pct: 30 + Math.random() * 60,
        avg_installment_rate: 2 + Math.random() * 8,
      };
    case "Operador Logístico":
      return {
        on_time_delivery_pct: 85 + Math.random() * 14,
        avg_delivery_days: 2 + Math.random() * 6,
        damage_rate_pct: Math.random() * 3,
        return_rate_pct: 2 + Math.random() * 8,
        sla_compliance_pct: 88 + Math.random() * 12,
        coverage_states: ["SP", "RJ", "MG", "PR", "SC", "RS"],
        avg_shipping_cost_brl: 10 + Math.random() * 25,
      };
    case "BPO":
      return {
        first_contact_resolution_pct: 60 + Math.random() * 35,
        avg_handle_time_minutes: 3 + Math.random() * 12,
        abandonment_rate_pct: 2 + Math.random() * 10,
        nps_score: 50 + Math.random() * 45,
        channels_covered: ["Chat", "Email", "WhatsApp", "Telefone"],
        ai_automation_pct: 10 + Math.random() * 50,
      };
    case "Consultoria":
      return {
        projects_completed: Math.floor(3 + Math.random() * 15),
        avg_roi_reported_pct: 50 + Math.random() * 150,
        client_satisfaction_score: 7 + Math.random() * 3,
        certifications: ["AWS Partner", "Google Cloud"],
        specializations: ["E-commerce", "Omnichannel", "Marketplace"],
      };
    case "Implementadora":
      return {
        stores_implemented: Math.floor(5 + Math.random() * 30),
        avg_go_live_days: 15 + Math.random() * 45,
        rework_rate_pct: Math.random() * 15,
        certified_developers: Math.floor(3 + Math.random() * 15),
        on_time_delivery_pct: 75 + Math.random() * 25,
      };
    case "Full Commerce":
      return {
        stores_operated: Math.floor(5 + Math.random() * 20),
        avg_gmv_managed_brl: 500000 + Math.random() * 5000000,
        avg_revenue_growth_pct: 10 + Math.random() * 40,
        services_bundled: ["Logística", "SAC", "Marketing", "Tecnologia"],
        avg_contract_duration_months: 12 + Math.random() * 24,
      };
    default:
      return {};
  }
}

export const mockPartnerKPIs: PartnerKPI[] = mockPartners.flatMap((p) =>
  generateKPIs(p.id, p.type)
);

export function getPartnerById(id: string): Partner | undefined {
  return mockPartners.find((p) => p.id === id);
}

export function getPartnerKPIs(partnerId: string): PartnerKPI[] {
  return mockPartnerKPIs.filter((k) => k.partner_id === partnerId);
}

export function getLatestKPI(partnerId: string): PartnerKPI | undefined {
  const kpis = getPartnerKPIs(partnerId);
  return kpis[kpis.length - 1];
}
