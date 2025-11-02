import { Partner } from "@/types/partner";
import { Store } from "@/types/store";
import { 
  PartnerRebate, 
  StoreTier, 
  StorePartnerMetrics,
  GartnerQuadrant,
  StoreRevenueBreakdownItem,
  calculateStoreTier,
  STORE_TIERS
} from "@/types/strategic-analysis";

// Calcular fit score baseado no tier da loja
export function calculateFitScore(
  partner: Partner, 
  store: Store
): number {
  const tier = store.tier || calculateStoreTier(store.metrics?.monthly_revenue || 0);
  return (partner as any).fitByTier?.[tier] || 50; // Default 50 se não configurado
}

// Calcular rebate mensal esperado
export function calculateMonthlyRebate(
  rebateConfig: PartnerRebate,
  storeGMV: number,
  partnerRevenue: number
): number {
  switch (rebateConfig.type) {
    case 'fixed_per_store':
      return rebateConfig.fixedValue || 0;
    
    case 'percentage_gmv':
      return storeGMV * (rebateConfig.percentageGMV || 0) / 100;
    
    case 'percentage_revenue':
      return partnerRevenue * (rebateConfig.percentageRevenue || 0) / 100;
    
    case 'tiered':
      const tier = rebateConfig.tiers?.find(t => 
        storeGMV >= t.minGMV && storeGMV <= t.maxGMV
      );
      return tier?.value || 0;
    
    case 'hybrid':
      // Combinação de fixed + percentual
      const fixed = rebateConfig.fixedValue || 0;
      const percentage = storeGMV * (rebateConfig.percentageGMV || 0) / 100;
      return Math.max(fixed + percentage, rebateConfig.minimumMonthly || 0);
    
    default:
      return 0;
  }
}

// Calcular rebate score (normalizado 0-100)
export function calculateRebateScore(
  totalRebate: number,
  totalGMV: number
): number {
  if (totalGMV === 0) return 0;
  
  // % de rebate sobre GMV
  const rebatePercentage = (totalRebate / totalGMV) * 100;
  
  // Normalizar para escala 0-100
  // Assumindo que 2% de rebate é o máximo ideal (score 100)
  return Math.min((rebatePercentage / 2) * 100, 100);
}

// Calcular posição no quadrante
export function calculateGartnerPosition(
  partners: Partner[],
  stores: Store[],
  storeMetrics: StorePartnerMetrics[]
): GartnerQuadrant[] {
  return partners.map(partner => {
    // Filtrar métricas deste parceiro
    const partnerMetrics = storeMetrics.filter(m => m.partnerId === partner.id);
    
    // Calcular agregados
    const totalStores = partnerMetrics.length;
    const totalGMV = partnerMetrics.reduce((sum, m) => sum + m.monthlyGMV, 0);
    const totalRebate = partnerMetrics.reduce((sum, m) => sum + m.rebateGenerated, 0);
    const avgFit = totalStores > 0 
      ? partnerMetrics.reduce((sum, m) => sum + m.fitScore, 0) / totalStores 
      : 0;
    
    // Calcular scores
    const fitScore = avgFit;
    const rebateScore = calculateRebateScore(totalRebate, totalGMV);
    
    // Classificar quadrante
    let quadrant: GartnerQuadrant['quadrant'] = 'laggard';
    if (fitScore >= 70 && rebateScore >= 70) quadrant = 'leader';
    else if (fitScore < 70 && rebateScore >= 70) quadrant = 'challenger';
    else if (fitScore >= 70 && rebateScore < 70) quadrant = 'niche';
    
    return {
      partnerId: partner.id,
      partnerName: partner.name,
      category: partner.categories[0],
      fitScore,
      rebateScore,
      totalStores,
      totalGMV,
      totalRebate,
      avgRebatePerStore: totalStores > 0 ? totalRebate / totalStores : 0,
      quadrant,
    };
  });
}

// Calcular breakdown de receita por loja
export function calculateStoreRevenueBreakdown(
  store: Store,
  partners: Partner[],
  storeMetrics: StorePartnerMetrics[]
): StoreRevenueBreakdownItem[] {
  const storePartnerMetrics = storeMetrics.filter(m => m.storeId === store.id);
  
  return storePartnerMetrics.map(metric => {
    const partner = partners.find(p => p.id === metric.partnerId);
    
    return {
      partnerId: metric.partnerId,
      partnerName: partner?.name || 'Desconhecido',
      category: partner?.categories[0] || 'payment',
      gmv: metric.monthlyGMV,
      partnerRevenue: metric.partnerRevenue,
      rebate: metric.rebateGenerated,
      rebatePercentage: metric.rebatePercentage,
      roi: metric.roi,
    };
  });
}

/**
 * Calculate fit score for payment methods based on store tier
 * Small stores: prefer low fixed fees, fast settlement
 * Large stores: prefer low percentages, advanced features
 */
export function calculatePaymentMethodFitScore(
  method: any, // PaymentMethod
  storeTier: 'small' | 'medium' | 'large' | 'enterprise'
): number {
  let score = 50; // Base score
  
  // Small stores (até R$ 50k/mês)
  if (storeTier === 'small') {
    // Prefer low or zero fixed fees
    if (method.pix?.baseRate < 1) score += 15;
    if (method.boleto?.fixedFee < 3) score += 10;
    if (method.debitCard?.baseRate < 2.5) score += 10;
    
    // Fast settlement is critical
    if (method.settlement?.pixDefault === 0) score += 10;
    if (method.settlement?.debitCardDefault <= 1) score += 5;
  }
  
  // Medium stores (R$ 50k - R$ 200k/mês)
  else if (storeTier === 'medium') {
    // Balance between fees and features
    if (method.creditCard?.feesByRevenue[0]?.baseRate < 4) score += 10;
    if (method.pix?.baseRate < 0.99) score += 10;
    
    // Advanced features start to matter
    if (method.integration?.hasFraudPrevention) score += 10;
    if (method.integration?.has3DS) score += 5;
  }
  
  // Large stores (R$ 200k - R$ 1M/mês)
  else if (storeTier === 'large') {
    // Low percentage rates are key
    if (method.creditCard?.feesByRevenue[0]?.baseRate < 3.5) score += 15;
    if (method.pix?.baseRate < 0.7) score += 10;
    
    // Advanced features are important
    if (method.integration?.hasFraudPrevention) score += 10;
    if (method.integration?.hasRiskScore) score += 5;
    if (method.receivablesAdvance?.available) score += 5;
  }
  
  // Enterprise stores (> R$ 1M/mês)
  else if (storeTier === 'enterprise') {
    // Best rates required
    if (method.creditCard?.feesByRevenue[0]?.baseRate < 3) score += 20;
    if (method.pix?.baseRate < 0.5) score += 10;
    
    // Full feature set required
    if (method.integration?.hasFraudPrevention) score += 5;
    if (method.integration?.hasRiskScore) score += 5;
    if (method.integration?.has3DS) score += 5;
    if (method.receivablesAdvance?.available) score += 5;
    if (method.platformSplit?.model) score += 5;
  }
  
  return Math.min(score, 100);
}
