import { Partner, LogisticPartnerData, PaymentPartnerData, MarketplacePartnerData } from "@/types/partner";
import { FieldConfig, DEFAULT_FIELD_CONFIGS } from "@/types/field-config";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  PartnerContact,
  PartnerActivity,
  PartnerHealthMetrics,
  PartnerTask,
  PartnerDocument,
  NewPartnerContact,
  NewPartnerActivity,
  NewPartnerHealthMetrics,
  NewPartnerTask,
  NewPartnerDocument,
} from "@/types/crm";
import {
  PartnerMonthlyMetric,
  NewPartnerMonthlyMetric,
} from "@/types/partner-metrics";

const DB_KEYS = {
  PARTNERS: 'partners',
  FIELD_CONFIGS: 'fieldConfigs',
  BLUR_ACTIVE: 'blurActive',
} as const;

// ==================== PARTNERS ====================

/**
 * Helper: Check if a partner belongs to a specific category
 * Supports both new format (categories array) and legacy format (category string)
 * @param partner - Partner to check
 * @param category - Category to check for
 * @returns true if partner has this category
 */
export function partnerHasCategory(partner: Partner, category: 'logistic' | 'payment' | 'marketplace'): boolean {
  // Check new format (categories array)
  if (partner.categories && Array.isArray(partner.categories)) {
    return partner.categories.includes(category);
  }

  // Check legacy format (category string) - for backward compatibility
  const legacyCategory = (partner as any).category;
  if (legacyCategory) {
    return legacyCategory === category;
  }

  return false;
}

/**
 * Helper: Filter partners by category
 * @param partners - Array of partners
 * @param category - Category to filter by
 * @returns Filtered array of partners
 */
export function filterPartnersByCategory(partners: Partner[], category: 'logistic' | 'payment' | 'marketplace'): Partner[] {
  return partners.filter(p => partnerHasCategory(p, category));
}

export async function savePartner(partner: Partner): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  // Determine primary category from categories array
  const primaryCategory = partner.categories[0] || 'logistic';

  // Ensure customFields and contactFields are preserved in the data
  const partnerData = {
    ...partner,
    customFields: partner.customFields || {},
    contactFields: partner.contactFields || {},
  };

        const { error } = await supabase
          .from('partners')
          .upsert({
            id: partner.id,
            user_id: user.id,
            name: partner.name,
            type: primaryCategory,
            data: partnerData as any,
            is_important: partner.isImportant || false,
            priority_rank: partner.priorityRank || null,
            pareto_focus: partner.paretoFocus || null,
          }, { onConflict: 'id' });

  if (error) {
    toast.error("Erro ao salvar parceiro");
    throw error;
  }
}

export async function getAllPartners(): Promise<Partner[]> {
  // ✅ Get current user for filtering
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('user_id', user.id) // ✅ Security: Filter by user_id (defense in depth)
    .order('created_at', { ascending: false });

  if (error) {
    toast.error("Erro ao carregar parceiros");
    throw error;
  }

  return (data || []).map(row => {
    const partner = row.data as any as Partner;
    // Include priority fields from database
    if (row.is_important !== undefined) partner.isImportant = row.is_important;
    if (row.priority_rank !== null && row.priority_rank !== undefined) partner.priorityRank = row.priority_rank;
    if (row.pareto_focus) partner.paretoFocus = row.pareto_focus as 'gmv' | 'rebate';
    return partner;
  });
}

export async function getPartnerById(id: string): Promise<Partner | undefined> {
  const partners = await getAllPartners();
  return partners.find(p => p.id === id);
}

// ==================== FIELD CONFIGS ====================

export function saveFieldConfigs(configs: FieldConfig[]): void {
  localStorage.setItem(DB_KEYS.FIELD_CONFIGS, JSON.stringify(configs));
}

export function getFieldConfigs(): FieldConfig[] {
  const data = localStorage.getItem(DB_KEYS.FIELD_CONFIGS);
  if (data) {
    return JSON.parse(data);
  }
  // Se não há dados salvos, retornar os defaults
  return DEFAULT_FIELD_CONFIGS;
}

export function getFieldConfigsByPartnerType(type: 'logistic' | 'payment' | 'marketplace'): FieldConfig[] {
  const configs = getFieldConfigs();
  return configs.filter(f => {
    // Retorna se o campo é específico desse tipo OU se está nos partnerTypes
    const isMainType = f.partnerType === type;
    const isInPartnerTypes = f.partnerTypes?.includes(type);
    return (isMainType || isInPartnerTypes) && f.enabled;
  });
}

// ==================== EXPORT/IMPORT ====================

export function exportDatabase(): string {
  const data = {
    partners: getAllPartners(),
    fieldConfigs: getFieldConfigs(),
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
  return JSON.stringify(data, null, 2);
}

export function importDatabase(jsonData: string): void {
  try {
    const data = JSON.parse(jsonData);
    if (data.partners) localStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify(data.partners));
    if (data.fieldConfigs) localStorage.setItem(DB_KEYS.FIELD_CONFIGS, JSON.stringify(data.fieldConfigs));
  } catch (error) {
    console.error('Erro ao importar banco de dados:', error);
    throw new Error('Dados inválidos');
  }
}

// ==================== PAYMENT METHODS ====================

export async function savePaymentMethod(paymentMethod: any): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('payment_methods')
    .upsert({
      id: paymentMethod.id,
      user_id: user.id,
      data: paymentMethod as any,
    }, { onConflict: 'id' });

  if (error) {
    toast.error("Erro ao salvar método de pagamento");
    throw error;
  }
}

export async function getAllPaymentMethods(): Promise<any[]> {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    toast.error("Erro ao carregar métodos de pagamento");
    throw error;
  }

  return (data || []).map(row => row.data as any);
}

export async function getPaymentMethodById(id: string): Promise<any | undefined> {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // Not found is ok
      toast.error("Erro ao carregar método de pagamento");
    }
    return undefined;
  }

  return data?.data as any;
}

export async function deletePaymentMethod(id: string): Promise<void> {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id);

  if (error) {
    toast.error("Erro ao excluir método de pagamento");
    throw error;
  }
}


// ==================== PARTNER CONTACTS ====================

export async function savePartnerContact(contact: NewPartnerContact & { id?: string }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('partner_contacts')
    .upsert({
      ...contact,
      id: contact.id || crypto.randomUUID(),
      user_id: user.id,
    }, { onConflict: 'id' });

  if (error) {
    toast.error("Erro ao salvar contato");
    throw error;
  }
}

export async function getPartnerContacts(partnerId: string): Promise<PartnerContact[]> {
  const { data, error } = await supabase
    .from('partner_contacts')
    .select('*')
    .eq('partner_id', partnerId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    toast.error("Erro ao carregar contatos");
    throw error;
  }

  return (data || []).map(row => ({
    ...row,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  }));
}

export async function deletePartnerContact(id: string): Promise<void> {
  const { error } = await supabase
    .from('partner_contacts')
    .delete()
    .eq('id', id);

  if (error) {
    toast.error("Erro ao excluir contato");
    throw error;
  }
}

// ==================== PARTNER ACTIVITIES ====================

export async function savePartnerActivity(activity: NewPartnerActivity & { id?: string }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  const activityData: any = {
    ...activity,
    user_id: user.id,
    participants: activity.participants as any,
  };

  if (activity.id) {
    activityData.id = activity.id;
  }

  const { error } = await supabase
    .from('partner_activities')
    .upsert(activityData, { onConflict: 'id' });

  if (error) {
    toast.error("Erro ao salvar atividade");
    throw error;
  }
}

export async function getPartnerActivities(partnerId?: string): Promise<PartnerActivity[]> {
  // ✅ Get current user for filtering
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  let query = supabase
    .from('partner_activities')
    .select('*')
    .eq('user_id', user.id) // ✅ Security: Filter by user_id (defense in depth)
    .order('scheduled_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (partnerId) {
    query = query.eq('partner_id', partnerId);
  }

  const { data, error } = await query;

  if (error) {
    toast.error("Erro ao carregar atividades");
    throw error;
  }

  return (data || []).map(row => ({
    ...row,
    participants: (row.participants as any) || [],
    scheduled_date: row.scheduled_date ? new Date(row.scheduled_date) : undefined,
    completed_date: row.completed_date ? new Date(row.completed_date) : undefined,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  }));
}

export async function deletePartnerActivity(id: string): Promise<void> {
  const { error } = await supabase
    .from('partner_activities')
    .delete()
    .eq('id', id);

  if (error) {
    toast.error("Erro ao excluir atividade");
    throw error;
  }
}

// ==================== PARTNER HEALTH METRICS ====================

export async function savePartnerHealthMetrics(metrics: NewPartnerHealthMetrics & { id?: string }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  const metricsData: any = {
    ...metrics,
    user_id: user.id,
  };

  if (metrics.id) {
    metricsData.id = metrics.id;
  }

  const { error } = await supabase
    .from('partner_health_metrics')
    .upsert(metricsData, { onConflict: 'partner_id' });

  if (error) {
    toast.error("Erro ao salvar métricas de saúde");
    throw error;
  }
}

export async function getPartnerHealthMetrics(partnerId: string): Promise<PartnerHealthMetrics | null> {
  const { data, error } = await supabase
    .from('partner_health_metrics')
    .select('*')
    .eq('partner_id', partnerId)
    .maybeSingle();

  if (error) {
    toast.error("Erro ao carregar métricas de saúde");
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    last_activity_date: data.last_activity_date ? new Date(data.last_activity_date) : undefined,
    calculated_at: new Date(data.calculated_at),
    created_at: new Date(data.created_at),
  };
}

export async function getAllPartnerHealthMetrics(): Promise<PartnerHealthMetrics[]> {
  const { data, error } = await supabase
    .from('partner_health_metrics')
    .select('*')
    .order('overall_score', { ascending: false, nullsFirst: false });

  if (error) {
    toast.error("Erro ao carregar métricas de saúde");
    throw error;
  }

  return (data || []).map(row => ({
    ...row,
    last_activity_date: row.last_activity_date ? new Date(row.last_activity_date) : undefined,
    calculated_at: new Date(row.calculated_at),
    created_at: new Date(row.created_at),
  }));
}

// ==================== PARTNER TASKS ====================

export async function savePartnerTask(task: NewPartnerTask & { id?: string }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  const taskData: any = {
    ...task,
    user_id: user.id,
  };

  if (task.id) {
    taskData.id = task.id;
  }

  const { error } = await supabase
    .from('partner_tasks')
    .upsert(taskData, { onConflict: 'id' });

  if (error) {
    toast.error("Erro ao salvar tarefa");
    throw error;
  }
}

export async function getPartnerTasks(partnerId?: string): Promise<PartnerTask[]> {
  // ✅ Get current user for filtering
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  let query = supabase
    .from('partner_tasks')
    .select('*')
    .eq('user_id', user.id) // ✅ Security: Filter by user_id (defense in depth)
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('priority', { ascending: false });

  if (partnerId) {
    query = query.eq('partner_id', partnerId);
  }

  const { data, error } = await query;

  if (error) {
    toast.error("Erro ao carregar tarefas");
    throw error;
  }

  return (data || []).map(row => ({
    ...row,
    due_date: row.due_date ? new Date(row.due_date) : undefined,
    completed_date: row.completed_date ? new Date(row.completed_date) : undefined,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  }));
}

export async function deletePartnerTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('partner_tasks')
    .delete()
    .eq('id', id);

  if (error) {
    toast.error("Erro ao excluir tarefa");
    throw error;
  }
}

// ==================== PARTNER DOCUMENTS ====================

export async function savePartnerDocument(document: NewPartnerDocument & { id?: string }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('partner_documents')
    .insert({
      ...document,
      id: document.id || crypto.randomUUID(),
      user_id: user.id,
    });

  if (error) {
    toast.error("Erro ao salvar documento");
    throw error;
  }
}

export async function getPartnerDocuments(partnerId: string): Promise<PartnerDocument[]> {
  const { data, error } = await supabase
    .from('partner_documents')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (error) {
    toast.error("Erro ao carregar documentos");
    throw error;
  }

  return (data || []).map(row => ({
    ...row,
    created_at: new Date(row.created_at),
  }));
}

export async function deletePartnerDocument(id: string): Promise<void> {
  const { error } = await supabase
    .from('partner_documents')
    .delete()
    .eq('id', id);

  if (error) {
    toast.error("Erro ao excluir documento");
    throw error;
  }
}

export async function deletePartner(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // ✅ Security: Ensure user can only delete their own partners

  if (error) {
    toast.error("Erro ao excluir parceiro");
    throw error;
  }
}

export async function clearDatabase(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  // Delete all user's data
  await supabase.from('partners').delete().eq('user_id', user.id);
  await supabase.from('payment_methods').delete().eq('user_id', user.id);
  await supabase.from('field_configs').delete().eq('user_id', user.id);
  await supabase.from('partner_contacts').delete().eq('user_id', user.id);
  await supabase.from('partner_activities').delete().eq('user_id', user.id);
  await supabase.from('partner_health_metrics').delete().eq('user_id', user.id);
  await supabase.from('partner_tasks').delete().eq('user_id', user.id);
  await supabase.from('partner_documents').delete().eq('user_id', user.id);
  
  toast.success("Dados removidos com sucesso");
}

// ==================== PARTNER MONTHLY METRICS ====================

export async function savePartnerMonthlyMetric(metric: NewPartnerMonthlyMetric & { id?: string }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  const metricData: any = {
    ...metric,
    user_id: user.id,
  };

  if (metric.id) {
    metricData.id = metric.id;
  } else {
    metricData.id = crypto.randomUUID();
  }

  // Use upsert com constraint único
  const { error } = await supabase
    .from('partner_monthly_metrics')
    .upsert({
      ...metricData,
      partner_id: metric.partnerId,
    }, { 
      onConflict: 'partner_id,user_id,year,month',
      ignoreDuplicates: false 
    });

  if (error) {
    toast.error("Erro ao salvar métrica mensal");
    throw error;
  }

  // Auto-update partner priorities based on new metrics
  try {
    const { autoUpdateSinglePartnerPriority } = await import('./partner-priority-auto');
    await autoUpdateSinglePartnerPriority(metric.partnerId);
  } catch (err) {
    // Don't fail if auto-update fails, just log it
    console.warn('Erro ao atualizar prioridades automaticamente:', err);
  }
}

export async function getPartnerMonthlyMetrics(partnerId: string): Promise<PartnerMonthlyMetric[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('partner_monthly_metrics')
    .select('*')
    .eq('partner_id', partnerId)
    .eq('user_id', user.id)
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  if (error) {
    toast.error("Erro ao carregar métricas mensais");
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    partnerId: row.partner_id,
    userId: row.user_id,
    year: row.year,
    month: row.month,
    gmvShare: Number(row.gmv_share) || 0,
    rebateShare: Number(row.rebate_share) || 0,
    gmvAmount: Number(row.gmv_amount) || 0,
    rebateAmount: Number(row.rebate_amount) || 0,
    notes: row.notes,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
}

export async function getAllPartnersMonthlyMetrics(year?: number, month?: number): Promise<PartnerMonthlyMetric[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  let query = supabase
    .from('partner_monthly_metrics')
    .select('*')
    .eq('user_id', user.id)
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  if (year) {
    query = query.eq('year', year);
  }
  if (month) {
    query = query.eq('month', month);
  }

  const { data, error } = await query;

  if (error) {
    toast.error("Erro ao carregar métricas mensais");
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    partnerId: row.partner_id,
    userId: row.user_id,
    year: row.year,
    month: row.month,
    gmvShare: Number(row.gmv_share) || 0,
    rebateShare: Number(row.rebate_share) || 0,
    gmvAmount: Number(row.gmv_amount) || 0,
    rebateAmount: Number(row.rebate_amount) || 0,
    notes: row.notes,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
}

// ==================== CALENDAR SYNC ====================

export interface CalendarSyncConfig {
  id: string;
  user_id: string;
  calendar_url: string | null;
  enabled: boolean;
  sync_interval_minutes: number;
  last_sync_at: Date | null;
  google_access_token: string | null;
  google_refresh_token: string | null;
  google_token_expires_at: Date | null;
  google_calendar_id: string;
  connected_via_oauth: boolean;
  created_at: Date;
  updated_at: Date;
}

export async function saveCalendarSyncConfig(config: {
  calendar_url?: string;
  enabled?: boolean;
  sync_interval_minutes?: number;
  google_access_token?: string;
  google_refresh_token?: string;
  google_token_expires_at?: Date | null;
  google_calendar_id?: string;
  connected_via_oauth?: boolean;
}): Promise<CalendarSyncConfig> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('user_calendar_sync')
    .upsert({
      user_id: user.id,
      calendar_url: config.calendar_url || null,
      enabled: config.enabled ?? true,
      sync_interval_minutes: config.sync_interval_minutes ?? 15,
      google_access_token: config.google_access_token || null,
      google_refresh_token: config.google_refresh_token || null,
      google_token_expires_at: config.google_token_expires_at?.toISOString() || null,
      google_calendar_id: config.google_calendar_id || 'primary',
      connected_via_oauth: config.connected_via_oauth ?? false,
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    toast.error("Erro ao salvar configuração do calendário");
    throw error;
  }

  return {
    ...data,
    calendar_url: data.calendar_url,
    last_sync_at: data.last_sync_at ? new Date(data.last_sync_at) : null,
    google_token_expires_at: data.google_token_expires_at ? new Date(data.google_token_expires_at) : null,
    google_access_token: data.google_access_token,
    google_refresh_token: data.google_refresh_token,
    google_calendar_id: data.google_calendar_id || 'primary',
    connected_via_oauth: data.connected_via_oauth || false,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
}

export async function getCalendarSyncConfig(): Promise<CalendarSyncConfig | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('user_calendar_sync')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    calendar_url: data.calendar_url,
    last_sync_at: data.last_sync_at ? new Date(data.last_sync_at) : null,
    google_token_expires_at: data.google_token_expires_at ? new Date(data.google_token_expires_at) : null,
    google_access_token: data.google_access_token,
    google_refresh_token: data.google_refresh_token,
    google_calendar_id: data.google_calendar_id || 'primary',
    connected_via_oauth: data.connected_via_oauth || false,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
}

export async function deleteCalendarSyncConfig(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('user_calendar_sync')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    toast.error("Erro ao excluir configuração do calendário");
    throw error;
  }
}

/**
 * Busca ou cria um parceiro genérico para atividades do calendário
 */
async function findOrCreateCalendarPartner(): Promise<Partner> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Buscar parceiro "Calendário" existente
  const { data: existing } = await supabase
    .from('partners')
    .select('*')
    .eq('user_id', user.id)
    .eq('name', 'Calendário Google')
    .maybeSingle();

  if (existing) {
    return existing as Partner;
  }

  // Criar novo parceiro genérico
  const newPartner: Partial<Partner> = {
    name: 'Calendário Google',
    categories: [],
    status: 'active',
    user_id: user.id,
  };

  const { data: created, error } = await supabase
    .from('partners')
    .insert(newPartner)
    .select()
    .single();

  if (error || !created) {
    throw new Error('Failed to create calendar partner');
  }

  return created as Partner;
}

export async function syncCalendarNow(): Promise<{ imported: number; skipped: number }> {
  const config = await getCalendarSyncConfig();
  if (!config) {
    throw new Error('Calendar sync not configured');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  let activities: any[] = [];

  try {
    // Se conectado via OAuth, usar Google Calendar API
    if (config.connected_via_oauth && config.google_access_token) {
      console.log('Syncing via OAuth (Google Calendar API)');
      
      // Verificar se token expirou e renovar se necessário
      let accessToken = config.google_access_token;
      if (config.google_token_expires_at && new Date(config.google_token_expires_at) < new Date()) {
        console.log('Token expirado, renovando...');
        if (!config.google_refresh_token) {
          throw new Error('Token expirado e refresh token não disponível. Por favor, reconecte.');
        }
        
        const { refreshAccessToken } = await import('./google-calendar-oauth');
        const newTokens = await refreshAccessToken(config.google_refresh_token);
        accessToken = newTokens.access_token;
        
        // Atualizar token no banco
        const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000);
        await supabase
          .from('user_calendar_sync')
          .update({
            google_access_token: accessToken,
            google_token_expires_at: expiresAt.toISOString(),
          })
          .eq('user_id', user.id);
      }
      
      // Buscar eventos via Google Calendar API
      const { fetchGoogleCalendarEvents, convertGoogleEventToActivity } = await import('./google-calendar-oauth');
      const googleEvents = await fetchGoogleCalendarEvents(
        accessToken,
        config.google_calendar_id || 'primary'
      );
      
      console.log('Fetched events from Google Calendar API:', googleEvents.length);
      
      // Converter eventos
      activities = googleEvents
        .map(event => convertGoogleEventToActivity(event, user.id))
        .filter(Boolean);
    } 
    // Senão, usar iCal feed (fallback)
    else if (config.calendar_url) {
      console.log('Importing calendar from iCal URL:', config.calendar_url);
      const { importFromICalFeed } = await import('./google-calendar-simple');
      activities = await importFromICalFeed(config.calendar_url);
    } else {
      throw new Error('Nenhum método de sincronização configurado (OAuth ou iCal)');
    }
    
    console.log('Imported activities count:', activities.length);

    let imported = 0;
    let skipped = 0;

    // Verificar quais eventos já existem (por google_event_id)
    const { data: existingActivitiesData, error: existingError } = await supabase
      .from('partner_activities')
      .select('google_event_id')
      .eq('user_id', user.id)
      .not('google_event_id', 'is', null);

    if (existingError) {
      console.error('Error checking existing activities:', existingError);
    }

    const existingIds = new Set(
      (existingActivitiesData || []).map(a => a.google_event_id).filter(Boolean)
    );
    
    console.log('Existing event IDs:', existingIds.size);

    // Importar apenas novos eventos
    for (const activity of activities) {
      if (!activity.google_event_id) {
        activity.google_event_id = `${activity.title}-${activity.scheduled_date?.getTime()}`;
      }

      // Pular se já existe
      if (existingIds.has(activity.google_event_id)) {
        skipped++;
        continue;
      }

      // Preencher campos obrigatórios
      (activity as any).user_id = user.id;
      
      // Se partner_id estiver vazio, tentar criar ou usar parceiro genérico "Calendário"
      if (!activity.partner_id || activity.partner_id.trim() === '') {
        // Buscar ou criar parceiro genérico para atividades do calendário
        const calendarPartner = await findOrCreateCalendarPartner();
        activity.partner_id = calendarPartner.id;
      }

      try {
        await savePartnerActivity(activity as NewPartnerActivity & { id?: string });
        imported++;
      } catch (error) {
        console.error('Error importing activity:', error);
        skipped++;
      }
    }

    // Atualizar last_sync_at
    await supabase
      .from('user_calendar_sync')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('user_id', user.id);

    return { imported, skipped };
  } catch (error) {
    console.error('Error syncing calendar:', error);
    throw error;
  }
}

export async function deletePartnerMonthlyMetric(id: string): Promise<void> {
  const { error } = await supabase
    .from('partner_monthly_metrics')
    .delete()
    .eq('id', id);

  if (error) {
    toast.error("Erro ao excluir métrica mensal");
    throw error;
  }
}

