// Types for partner monthly metrics and priority management

export interface PartnerMonthlyMetric {
  id: string;
  partnerId: string;
  userId: string;
  year: number;
  month: number; // 1-12
  gmvShare: number; // % de participação no GMV total do mês
  rebateShare: number; // % de participação no rebate total do mês
  gmvAmount: number; // Valor absoluto de GMV transacionado (R$)
  rebateAmount: number; // Valor absoluto de rebate gerado (R$)
  numberOfStores: number; // Número de lojas ativas no mês
  approvalRate: number; // Taxa de aprovação (%)
  numberOfOrders: number; // Número total de pedidos no mês
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewPartnerMonthlyMetric {
  partnerId: string;
  year: number;
  month: number;
  gmvShare: number;
  rebateShare: number;
  gmvAmount: number;
  rebateAmount: number;
  numberOfStores: number;
  approvalRate: number;
  numberOfOrders: number;
  notes?: string;
}

export interface PartnerPriority {
  isImportant: boolean;
  priorityRank?: number; // 1 = 1º lugar, 2 = 2º lugar, etc (não limitado a top 3)
  paretoFocus?: 'gmv' | 'rebate'; // Qual métrica está sendo usada para análise Pareto
}

export interface PartnerMetricsSummary {
  partnerId: string;
  partnerName: string;
  // Último mês
  lastMonth: PartnerMonthlyMetric | null;
  // Média dos últimos 3 meses
  averageLast3Months: {
    gmvShare: number;
    rebateShare: number;
    gmvAmount: number;
    rebateAmount: number;
  };
  // Tendência
  trend: {
    gmvShare: 'up' | 'down' | 'stable';
    rebateShare: 'up' | 'down' | 'stable';
  };
}

