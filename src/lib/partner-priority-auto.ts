/**
 * Auto-update partner priority based on monthly metrics (Pareto analysis)
 * 
 * This module automatically calculates and updates partner priority ranking
 * based on monthly GMV/rebate metrics, following the Pareto principle (80/20).
 */

import { getAllPartners, savePartner } from "./db";
import { getAllPartnersMonthlyMetrics } from "./db";
import { Partner } from "@/types/partner";
import { PartnerMonthlyMetric } from "@/types/partner-metrics";

interface PartnerMetricsAggregated {
  partnerId: string;
  partnerName: string;
  totalGMV: number;
  totalRebate: number;
  avgGMVShare: number;
  avgRebateShare: number;
  monthsCount: number;
}

/**
 * Get the most recent month's metrics for all partners
 */
async function getLatestMetrics(): Promise<Map<string, PartnerMonthlyMetric>> {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  // Try current month first, then previous month
  let metrics = await getAllPartnersMonthlyMetrics(currentYear, currentMonth);
  if (metrics.length === 0 && currentMonth > 1) {
    metrics = await getAllPartnersMonthlyMetrics(currentYear, currentMonth - 1);
  } else if (metrics.length === 0) {
    // Try previous year's December
    metrics = await getAllPartnersMonthlyMetrics(currentYear - 1, 12);
  }
  
  const metricsMap = new Map<string, PartnerMonthlyMetric>();
  metrics.forEach(m => {
    metricsMap.set(m.partnerId, m);
  });
  
  return metricsMap;
}

/**
 * Aggregate metrics for all partners (average of last 3 months or latest available)
 */
async function aggregatePartnerMetrics(): Promise<PartnerMetricsAggregated[]> {
  const partners = await getAllPartners();
  const allMetrics = await getAllPartnersMonthlyMetrics();
  
  // Group metrics by partner
  const metricsByPartner = new Map<string, PartnerMonthlyMetric[]>();
  allMetrics.forEach(metric => {
    const existing = metricsByPartner.get(metric.partnerId) || [];
    existing.push(metric);
    metricsByPartner.set(metric.partnerId, existing);
  });
  
  // Calculate aggregated metrics per partner
  const aggregated: PartnerMetricsAggregated[] = [];
  
  partners.forEach(partner => {
    const metrics = metricsByPartner.get(partner.id) || [];
    
    if (metrics.length === 0) {
      // No metrics yet
      aggregated.push({
        partnerId: partner.id,
        partnerName: partner.name,
        totalGMV: 0,
        totalRebate: 0,
        avgGMVShare: 0,
        avgRebateShare: 0,
        monthsCount: 0,
      });
      return;
    }
    
    // Get last 3 months (most recent)
    const sortedMetrics = metrics
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      })
      .slice(0, 3);
    
    const totalGMV = sortedMetrics.reduce((sum, m) => sum + m.gmvAmount, 0);
    const totalRebate = sortedMetrics.reduce((sum, m) => sum + m.rebateAmount, 0);
    const avgGMVShare = sortedMetrics.reduce((sum, m) => sum + m.gmvShare, 0) / sortedMetrics.length;
    const avgRebateShare = sortedMetrics.reduce((sum, m) => sum + m.rebateShare, 0) / sortedMetrics.length;
    
    aggregated.push({
      partnerId: partner.id,
      partnerName: partner.name,
      totalGMV,
      totalRebate,
      avgGMVShare,
      avgRebateShare,
      monthsCount: sortedMetrics.length,
    });
  });
  
  return aggregated;
}

/**
 * Calculate priority ranking based on Pareto analysis
 * @param metrics - Aggregated metrics for all partners
 * @param focus - 'gmv' or 'rebate'
 * @returns Map of partnerId -> priority rank
 */
function calculatePriorityRanking(
  metrics: PartnerMetricsAggregated[],
  focus: 'gmv' | 'rebate'
): Map<string, number> {
  // Filter partners with metrics
  const partnersWithMetrics = metrics.filter(m => m.monthsCount > 0);
  
  if (partnersWithMetrics.length === 0) {
    return new Map();
  }
  
  // Sort by focus metric (descending)
  const sorted = [...partnersWithMetrics].sort((a, b) => {
    if (focus === 'gmv') {
      return b.totalGMV - a.totalGMV;
    } else {
      return b.totalRebate - a.totalRebate;
    }
  });
  
  // Calculate cumulative percentage to find Pareto cutoff (80%)
  const total = sorted.reduce((sum, m) => 
    sum + (focus === 'gmv' ? m.totalGMV : m.totalRebate), 0
  );
  
  let cumulative = 0;
  const ranking = new Map<string, number>();
  let currentRank = 1;
  
  sorted.forEach((partner, index) => {
    const value = focus === 'gmv' ? partner.totalGMV : partner.totalRebate;
    cumulative += value;
    const percentage = (cumulative / total) * 100;
    
    ranking.set(partner.partnerId, currentRank);
    
    // Only increment rank if this partner contributes significantly
    // Partners beyond 80% might have same rank if they're very small
    if (index < sorted.length - 1) {
      const nextValue = focus === 'gmv' ? sorted[index + 1].totalGMV : sorted[index + 1].totalRebate;
      const nextPercentage = nextValue / total * 100;
      
      // If next partner has significant contribution (>1% of total), increment rank
      if (nextPercentage > 1) {
        currentRank++;
      }
    }
  });
  
  return ranking;
}

/**
 * Determine if partner should be marked as important
 * Based on Pareto: top partners that generate ~80% of value
 */
function determineImportantPartners(
  metrics: PartnerMetricsAggregated[],
  ranking: Map<string, number>,
  focus: 'gmv' | 'rebate'
): Set<string> {
  const partnersWithMetrics = metrics.filter(m => m.monthsCount > 0);
  const sorted = [...partnersWithMetrics].sort((a, b) => {
    if (focus === 'gmv') {
      return b.totalGMV - a.totalGMV;
    } else {
      return b.totalRebate - a.totalRebate;
    }
  });
  
  const total = sorted.reduce((sum, m) => 
    sum + (focus === 'gmv' ? m.totalGMV : m.totalRebate), 0
  );
  
  let cumulative = 0;
  const important = new Set<string>();
  
  // Mark partners as important until we reach ~80% of total value
  for (const partner of sorted) {
    const value = focus === 'gmv' ? partner.totalGMV : partner.totalRebate;
    cumulative += value;
    const percentage = (cumulative / total) * 100;
    
    important.add(partner.partnerId);
    
    // Stop when we reach 80% or after top 5 partners (whichever comes first)
    if (percentage >= 80 || important.size >= 5) {
      break;
    }
  }
  
  return important;
}

/**
 * Auto-update partner priorities based on monthly metrics
 * This should be called after saving monthly metrics
 */
export async function autoUpdatePartnerPriorities(focus?: 'gmv' | 'rebate'): Promise<void> {
  try {
    const partners = await getAllPartners();
    const aggregated = await aggregatePartnerMetrics();
    
    // Determine focus: use partner's pareto_focus if set, otherwise use parameter or default to 'gmv'
    const defaultFocus = focus || 'gmv';
    
    // Group partners by their pareto_focus preference
    const partnersByFocus = new Map<'gmv' | 'rebate', Partner[]>();
    partnersByFocus.set('gmv', []);
    partnersByFocus.set('rebate', []);
    
    partners.forEach(partner => {
      const partnerFocus = partner.paretoFocus || defaultFocus;
      const group = partnersByFocus.get(partnerFocus) || [];
      group.push(partner);
      partnersByFocus.set(partnerFocus, group);
    });
    
    // Update priorities for each focus group
    for (const [focusType, focusPartners] of partnersByFocus.entries()) {
      const focusMetrics = aggregated.filter(m => 
        focusPartners.some(p => p.id === m.partnerId)
      );
      
      const ranking = calculatePriorityRanking(focusMetrics, focusType);
      const important = determineImportantPartners(focusMetrics, ranking, focusType);
      
      // Update each partner in this focus group
      for (const partner of focusPartners) {
        const rank = ranking.get(partner.id);
        const isImportant = important.has(partner.id);
        
        // Update priority rank and important status
      // Always update to reflect latest metrics, even if rank is undefined (no metrics yet)
      const updatedPartner: Partner = {
        ...partner,
        isImportant: isImportant,
        priorityRank: rank,
        paretoFocus: partner.paretoFocus || focusType, // Keep existing preference or set default
      };
      
      await savePartner(updatedPartner);
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar prioridades automaticamente:', error);
    throw error;
  }
}

/**
 * Auto-update priorities for a specific partner after saving their metrics
 */
export async function autoUpdateSinglePartnerPriority(partnerId: string): Promise<void> {
  const partners = await getAllPartners();
  const partner = partners.find(p => p.id === partnerId);
  
  if (!partner) return;
  
  const focus = partner.paretoFocus || 'gmv';
  
  // Recalculate all priorities (simpler approach)
  await autoUpdatePartnerPriorities(focus);
}

