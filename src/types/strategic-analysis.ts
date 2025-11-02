// Types for Strategic Partner Analysis (Gartner Quadrant)

// Tier de loja baseado em GMV mensal
export type StoreTier = 'small' | 'medium' | 'large' | 'enterprise';

// Tipo de rebate
export type RebateType = 
  | 'fixed_per_store'      // Valor fixo por loja
  | 'percentage_gmv'       // % sobre GMV gerado
  | 'percentage_revenue'   // % sobre receita do parceiro
  | 'tiered'               // Escalonado por volume
  | 'hybrid';              // Combinação

// Estrutura de rebate do parceiro
export interface PartnerRebate {
  type: RebateType;
  fixedValue?: number;           // Valor fixo mensal (ex: R$ 500/loja)
  percentageGMV?: number;        // % sobre GMV da loja (ex: 0.5%)
  percentageRevenue?: number;    // % sobre receita do parceiro (ex: 10%)
  tiers?: {                      // Tabela escalonada
    minGMV: number;
    maxGMV: number;
    value: number;
  }[];
  minimumMonthly?: number;       // Garantia mínima mensal
}

// Fit do parceiro por tier de loja
export interface PartnerFitByTier {
  small: number;      // Score 0-100
  medium: number;     // Score 0-100
  large: number;      // Score 0-100
  enterprise: number; // Score 0-100
}

// Métricas de rebate e receita por loja
export interface StorePartnerMetrics {
  storeId: string;
  partnerId: string;
  storeTier: StoreTier;
  monthlyGMV: number;              // GMV gerado pela loja
  partnerRevenue: number;          // Receita do parceiro com essa loja
  rebateGenerated: number;         // Rebate gerado para nós
  rebatePercentage: number;        // % de rebate sobre receita do parceiro
  fitScore: number;                // Score de aderência (0-100)
  roi: number;                     // ROI da parceria
  lastUpdated: Date;
}

// Posição no quadrante de Gartner
export interface GartnerQuadrant {
  partnerId: string;
  partnerName: string;
  category: 'logistic' | 'payment' | 'marketplace';
  
  // Coordenadas
  fitScore: number;                // Eixo X (0-100)
  rebateScore: number;             // Eixo Y (0-100)
  
  // Detalhamento
  totalStores: number;
  totalGMV: number;
  totalRebate: number;
  avgRebatePerStore: number;
  
  // Classificação no quadrante
  quadrant: 'leader' | 'challenger' | 'niche' | 'laggard';
}

// Breakdown de receita por loja
export interface StoreRevenueBreakdownItem {
  partnerId: string;
  partnerName: string;
  category: 'logistic' | 'payment' | 'marketplace';
  gmv: number;
  partnerRevenue: number;
  rebate: number;
  rebatePercentage: number;
  roi: number;
}

// Tier da loja baseado em GMV
export const STORE_TIERS = {
  small: { min: 0, max: 50000, label: 'Pequena' },           // Até R$ 50k/mês
  medium: { min: 50000, max: 200000, label: 'Média' },       // R$ 50k - R$ 200k/mês
  large: { min: 200000, max: 1000000, label: 'Grande' },     // R$ 200k - R$ 1M/mês
  enterprise: { min: 1000000, max: Infinity, label: 'Enterprise' }, // Acima de R$ 1M/mês
};

// Classificação dos quadrantes
export const QUADRANTS = {
  leader: { 
    fitMin: 70, rebateMin: 70, 
    label: 'Líderes', 
    color: 'hsl(var(--success))', 
    description: 'Alto fit e alto rebate' 
  },
  challenger: { 
    fitMin: 0, fitMax: 70, rebateMin: 70, 
    label: 'Desafiantes', 
    color: 'hsl(var(--warning))', 
    description: 'Baixo fit mas alto rebate' 
  },
  niche: { 
    fitMin: 70, rebateMin: 0, rebateMax: 70, 
    label: 'Nicho', 
    color: 'hsl(var(--primary))', 
    description: 'Alto fit mas baixo rebate' 
  },
  laggard: { 
    fitMin: 0, fitMax: 70, rebateMin: 0, rebateMax: 70, 
    label: 'Retardatários', 
    color: 'hsl(var(--destructive))', 
    description: 'Baixo fit e baixo rebate' 
  },
};

// Função helper para calcular tier
export const calculateStoreTier = (monthlyRevenue: number): StoreTier => {
  if (monthlyRevenue >= STORE_TIERS.enterprise.min) return 'enterprise';
  if (monthlyRevenue >= STORE_TIERS.large.min) return 'large';
  if (monthlyRevenue >= STORE_TIERS.medium.min) return 'medium';
  return 'small';
};
