import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PartnerMonthlyMetric, NewPartnerMonthlyMetric } from "@/types/partner-metrics";

// ==================== MONTHLY METRICS ====================

export async function upsertMonthlyMetric(
  payload: NewPartnerMonthlyMetric
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    const { error } = await supabase
      .from('partner_monthly_metrics')
      .upsert({
        partner_id: payload.partnerId,
        user_id: user.id,
        year: payload.year,
        month: payload.month,
        gmv_share: payload.gmvShare,
        rebate_share: payload.rebateShare,
        gmv_amount: payload.gmvAmount,
        rebate_amount: payload.rebateAmount,
        notes: payload.notes,
      }, {
        onConflict: 'partner_id,user_id,year,month'
      });

    if (error) {
      console.error("Error upserting metric:", error);
      toast.error("Erro ao salvar métrica");
      return false;
    }

    toast.success("Métrica salva com sucesso");
    return true;
  } catch (error) {
    console.error("Error in upsertMonthlyMetric:", error);
    toast.error("Erro ao salvar métrica");
    return false;
  }
}

export async function getPartnerMonthlyMetrics(
  partnerId: string
): Promise<PartnerMonthlyMetric[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('partner_monthly_metrics')
      .select('*')
      .eq('partner_id', partnerId)
      .eq('user_id', user.id)
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
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
  } catch (error) {
    console.error("Error loading monthly metrics:", error);
    toast.error("Erro ao carregar métricas");
    return [];
  }
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

export async function getFinancialSummary(
  params?: FinancialSummaryParams
): Promise<PartnerFinancialSummary[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get all metrics with optional date filtering
    let query = supabase
      .from('partner_monthly_metrics')
      .select(`
        *,
        partners!inner(id, name, data)
      `)
      .eq('user_id', user.id);

    // Apply date filters if provided
    if (params?.startYear && params?.startMonth) {
      query = query.gte('year', params.startYear);
    }
    if (params?.endYear && params?.endMonth) {
      query = query.lte('year', params.endYear);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group by partner and aggregate
    const summaryMap = new Map<string, {
      partnerId: string;
      partnerName: string;
      totalGmv: number;
      totalRebate: number;
      gmvShares: number[];
      rebateShares: number[];
    }>();

    (data || []).forEach((row: any) => {
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
          partnerName: row.partners.name || 'Nome não encontrado',
          totalGmv: Number(row.gmv_amount),
          totalRebate: Number(row.rebate_amount),
          gmvShares: [Number(row.gmv_share)],
          rebateShares: [Number(row.rebate_share)],
        });
      }
    });

    // Calculate averages and format result
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

export async function deleteMonthlyMetric(
  metricId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('partner_monthly_metrics')
      .delete()
      .eq('id', metricId);

    if (error) {
      console.error("Error deleting metric:", error);
      toast.error("Erro ao deletar métrica");
      return false;
    }

    toast.success("Métrica deletada");
    return true;
  } catch (error) {
    console.error("Error in deleteMonthlyMetric:", error);
    toast.error("Erro ao deletar métrica");
    return false;
  }
}
