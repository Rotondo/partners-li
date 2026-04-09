import { toast } from "sonner";
import { PartnerMonthlyMetric, NewPartnerMonthlyMetric } from "@/types/partner-metrics";
import { ldbGetAll, ldbSetAll, ldbFind, ldbDelete } from "./local-db";

const LOCAL_USER_ID = 'local';

// ==================== MONTHLY METRICS ====================

export async function upsertMonthlyMetric(payload: NewPartnerMonthlyMetric): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    const all = ldbGetAll<any>('partner_monthly_metrics');
    const idx = all.findIndex((r: any) =>
      r.partner_id === payload.partnerId && r.year === payload.year && r.month === payload.month
    );
    const record = {
      id: idx >= 0 ? all[idx].id : crypto.randomUUID(),
      partner_id: payload.partnerId,
      user_id: LOCAL_USER_ID,
      year: payload.year,
      month: payload.month,
      gmv_share: payload.gmvShare,
      rebate_share: payload.rebateShare,
      gmv_amount: payload.gmvAmount,
      rebate_amount: payload.rebateAmount,
      notes: payload.notes,
      created_at: idx >= 0 ? all[idx].created_at : now,
      updated_at: now,
    };
    if (idx >= 0) {
      all[idx] = record;
    } else {
      all.unshift(record);
    }
    ldbSetAll('partner_monthly_metrics', all);
    toast.success("Métrica salva com sucesso");
    return true;
  } catch (error) {
    console.error("Error in upsertMonthlyMetric:", error);
    toast.error("Erro ao salvar métrica");
    return false;
  }
}

export async function getPartnerMonthlyMetrics(partnerId: string): Promise<PartnerMonthlyMetric[]> {
  const rows = ldbFind<any>('partner_monthly_metrics', (r: any) => r.partner_id === partnerId);
  rows.sort((a: any, b: any) => b.year !== a.year ? b.year - a.year : b.month - a.month);
  return rows.map((row: any) => ({
    id: row.id,
    partnerId: row.partner_id,
    userId: row.user_id,
    year: row.year,
    month: row.month,
    gmvShare: Number(row.gmv_share),
    rebateShare: Number(row.rebate_share),
    gmvAmount: Number(row.gmv_amount),
    rebateAmount: Number(row.rebate_amount),
    notes: row.notes,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
}

// ==================== FINANCIAL SUMMARY ====================

export interface FinancialSummaryParams {
  startYear?: number;
  startMonth?: number;
  endYear?: number;
  endMonth?: number;
}

export interface PartnerFinancialSummary {
  partnerId: string;
  partnerName: string;
  totalGmv: number;
  totalRebate: number;
  avgGmvShare: number;
  avgRebateShare: number;
  monthCount: number;
}

export async function getFinancialSummary(params?: FinancialSummaryParams): Promise<PartnerFinancialSummary[]> {
  try {
    let rows = ldbGetAll<any>('partner_monthly_metrics');
    if (params?.startYear) rows = rows.filter((r: any) => r.year >= params.startYear!);
    if (params?.endYear) rows = rows.filter((r: any) => r.year <= params.endYear!);

    const partners = ldbGetAll<any>('partners');
    const partnerMap = new Map(partners.map((p: any) => [p.id, p.name]));

    const summaryMap = new Map<string, {
      partnerId: string;
      partnerName: string;
      totalGmv: number;
      totalRebate: number;
      gmvShares: number[];
      rebateShares: number[];
    }>();

    rows.forEach((row: any) => {
      const partnerId = row.partner_id;
      const existing = summaryMap.get(partnerId);
      if (existing) {
        existing.totalGmv += Number(row.gmv_amount);
        existing.totalRebate += Number(row.rebate_amount);
        existing.gmvShares.push(Number(row.gmv_share));
        existing.rebateShares.push(Number(row.rebate_share));
      } else {
        summaryMap.set(partnerId, {
          partnerId,
          partnerName: partnerMap.get(partnerId) || 'Nome não encontrado',
          totalGmv: Number(row.gmv_amount),
          totalRebate: Number(row.rebate_amount),
          gmvShares: [Number(row.gmv_share)],
          rebateShares: [Number(row.rebate_share)],
        });
      }
    });

    return Array.from(summaryMap.values()).map(item => ({
      partnerId: item.partnerId,
      partnerName: item.partnerName,
      totalGmv: item.totalGmv,
      totalRebate: item.totalRebate,
      avgGmvShare: item.gmvShares.reduce((a, b) => a + b, 0) / item.gmvShares.length,
      avgRebateShare: item.rebateShares.reduce((a, b) => a + b, 0) / item.rebateShares.length,
      monthCount: item.gmvShares.length,
    }));
  } catch (error) {
    console.error("Error loading financial summary:", error);
    toast.error("Erro ao carregar resumo financeiro");
    return [];
  }
}

export async function deleteMonthlyMetric(metricId: string): Promise<boolean> {
  try {
    ldbDelete('partner_monthly_metrics', metricId);
    toast.success("Métrica deletada");
    return true;
  } catch (error) {
    console.error("Error in deleteMonthlyMetric:", error);
    toast.error("Erro ao deletar métrica");
    return false;
  }
}
