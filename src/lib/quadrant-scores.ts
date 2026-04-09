import { Partner, PartnerKPI } from "@/types/ecosystem-partner";

export interface QuadrantScores {
  segment_quality_score: number;
  market_presence_score: number;
  team_size_score: number;
  financial_health_score: number;
  product_roadmap_score: number;
  partnership_engagement_score: number;
}

export interface ComputedQuadrantPoint {
  partnerId: string;
  partner: Partner;
  x: number; // Quality & Adherence (0-100)
  y: number; // Capability & Growth Vision (0-100)
  originalX: number;
  originalY: number;
  radius: number;
  xBreakdown: { label: string; value: number; weight: number }[];
  yBreakdown: { label: string; value: number; weight: number }[];
}

// Generate deterministic mock scores from partner id
function mockManualScores(partnerId: string): QuadrantScores {
  const seed = parseInt(partnerId, 10) || hashCode(partnerId);
  const s = (offset: number) => Math.round(((Math.abs(seed * (offset + 7)) % 100) / 10) * 10) / 10;
  return {
    segment_quality_score: Math.min(10, Math.max(1, s(1))),
    market_presence_score: Math.min(10, Math.max(1, s(2))),
    team_size_score: [2.0, 4.5, 7.0, 9.5][Math.abs(seed * 3) % 4],
    financial_health_score: Math.min(10, Math.max(1, s(4))),
    product_roadmap_score: Math.min(10, Math.max(1, s(5))),
    partnership_engagement_score: Math.min(10, Math.max(1, s(6))),
  };
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function computeXScore(
  kpi: PartnerKPI,
  manualScores: QuadrantScores,
  maxStoresInEco: number
): { score: number; breakdown: { label: string; value: number; weight: number }[] } {
  const npsNorm = (kpi.nps_score / 100) * 100; // already 0-100
  const csatNorm = (kpi.csat_score / 100) * 100;
  const uptime = kpi.integration_uptime_pct;
  const storesLog = maxStoresInEco > 1
    ? (Math.log(kpi.stores_using + 1) / Math.log(maxStoresInEco + 1)) * 100
    : 50;
  const churnInv = kpi.stores_using > 0
    ? Math.max(0, 100 - (kpi.stores_churned / kpi.stores_using) * 100)
    : 100;
  const segQuality = manualScores.segment_quality_score * 10;

  const breakdown = [
    { label: "NPS", value: npsNorm, weight: 0.20 },
    { label: "CSAT", value: csatNorm, weight: 0.15 },
    { label: "Uptime", value: uptime, weight: 0.15 },
    { label: "Lojas Ativas (log)", value: storesLog, weight: 0.20 },
    { label: "Retenção (1-churn)", value: churnInv, weight: 0.15 },
    { label: "Qualidade Técnica", value: segQuality, weight: 0.15 },
  ];

  const score = Math.round(breakdown.reduce((acc, b) => acc + b.value * b.weight, 0) * 100) / 100;
  return { score, breakdown };
}

export function computeYScore(
  manualScores: QuadrantScores,
  revenueGrowthTrend: number // -100 to +100 normalized
): { score: number; breakdown: { label: string; value: number; weight: number }[] } {
  const breakdown = [
    { label: "Presença de Mercado", value: manualScores.market_presence_score * 10, weight: 0.20 },
    { label: "Tamanho do Time", value: manualScores.team_size_score * 10, weight: 0.15 },
    { label: "Solidez Financeira", value: manualScores.financial_health_score * 10, weight: 0.15 },
    { label: "Roadmap de Produto", value: manualScores.product_roadmap_score * 10, weight: 0.20 },
    { label: "Engajamento LI", value: manualScores.partnership_engagement_score * 10, weight: 0.15 },
    { label: "Tendência de Crescimento", value: Math.max(0, Math.min(100, 50 + revenueGrowthTrend)), weight: 0.15 },
  ];

  const score = Math.round(breakdown.reduce((acc, b) => acc + b.value * b.weight, 0) * 100) / 100;
  return { score, breakdown };
}

// Compute revenue growth trend from KPI history (simplified slope)
function computeGrowthTrend(kpis: PartnerKPI[]): number {
  if (kpis.length < 2) return 0;
  const sorted = [...kpis].sort((a, b) => a.period.localeCompare(b.period));
  const first = sorted[0].stores_using;
  const last = sorted[sorted.length - 1].stores_using;
  if (first === 0) return 50;
  const growthPct = ((last - first) / first) * 100;
  return Math.max(-50, Math.min(50, growthPct));
}

// Anti-overlap system
function applyAntiOverlap(points: ComputedQuadrantPoint[]): ComputedQuadrantPoint[] {
  const MIN_DIST = 2.5;
  const result = points.map((p) => ({ ...p }));

  for (let i = 0; i < result.length; i++) {
    for (let j = i + 1; j < result.length; j++) {
      const dx = result[j].x - result[i].x;
      const dy = result[j].y - result[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MIN_DIST) {
        const angle = (parseInt(result[j].partnerId, 10) || hashCode(result[j].partnerId)) % 360 * (Math.PI / 180);
        const offset = (MIN_DIST - dist) / 2 + 0.5;
        result[j].x = Math.max(0, Math.min(100, result[j].x + Math.cos(angle) * offset));
        result[j].y = Math.max(0, Math.min(100, result[j].y + Math.sin(angle) * offset));
        result[i].x = Math.max(0, Math.min(100, result[i].x - Math.cos(angle) * offset));
        result[i].y = Math.max(0, Math.min(100, result[i].y - Math.sin(angle) * offset));
      }
    }
  }

  return result;
}

export function computeAllQuadrantPoints(
  partners: Partner[],
  allKpis: PartnerKPI[],
  manualScoresMap?: Record<string, QuadrantScores>
): ComputedQuadrantPoint[] {
  const maxStores = Math.max(...allKpis.map((k) => k.stores_using), 1);

  const points: ComputedQuadrantPoint[] = partners
    .map((partner) => {
      const partnerKpis = allKpis.filter((k) => k.partner_id === partner.id);
      const latestKpi = partnerKpis[partnerKpis.length - 1];
      if (!latestKpi) return null;

      const scores = manualScoresMap?.[partner.id] ?? mockManualScores(partner.id);
      const growthTrend = computeGrowthTrend(partnerKpis);
      const xResult = computeXScore(latestKpi, scores, maxStores);
      const yResult = computeYScore(scores, growthTrend);

      const minRadius = 12;
      const maxRadius = 40;
      const storesNorm = Math.log(latestKpi.stores_using + 1) / Math.log(maxStores + 1);
      const radius = minRadius + storesNorm * (maxRadius - minRadius);

      return {
        partnerId: partner.id,
        partner,
        x: xResult.score,
        y: yResult.score,
        originalX: xResult.score,
        originalY: yResult.score,
        radius,
        xBreakdown: xResult.breakdown,
        yBreakdown: yResult.breakdown,
      };
    })
    .filter(Boolean) as ComputedQuadrantPoint[];

  return applyAntiOverlap(points);
}
