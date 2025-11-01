import { Partner } from "@/types/partner";
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
    toast.error("Usuário não autenticado");
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

  return (data || []).map(row => row.data as any as Partner);
}

export async function getPartnerById(id: string): Promise<Partner | undefined> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // Not found is ok
      toast.error("Erro ao carregar parceiro");
    }
    return undefined;
  }

  return data?.data as any as Partner;
}

export async function deletePartner(id: string): Promise<void> {
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', id);

  if (error) {
    toast.error("Erro ao excluir parceiro");
    throw error;
  }
}

// ==================== FIELD CONFIGS ====================

export async function saveFieldConfigs(configs: FieldConfig[]): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  // Check if config exists
  const { data: existing } = await supabase
    .from('field_configs')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from('field_configs')
      .update({ config: configs as any })
      .eq('user_id', user.id);
    
    if (error) {
      toast.error("Erro ao salvar configurações");
      throw error;
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from('field_configs')
      .insert({ user_id: user.id, config: configs as any });
    
    if (error) {
      toast.error("Erro ao salvar configurações");
      throw error;
    }
  }
}

export async function getFieldConfigs(): Promise<FieldConfig[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return DEFAULT_FIELD_CONFIGS;

  const { data, error } = await supabase
    .from('field_configs')
    .select('config')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Not found
      return DEFAULT_FIELD_CONFIGS;
    }
    return DEFAULT_FIELD_CONFIGS;
  }

  return data?.config as any as FieldConfig[] || DEFAULT_FIELD_CONFIGS;
}

export async function getFieldConfigsByPartnerType(type: 'logistic' | 'payment' | 'marketplace'): Promise<FieldConfig[]> {
  const configs = await getFieldConfigs();
  return configs.filter(f => f.partnerType === type && f.enabled);
}

// ==================== EXPORT/IMPORT ====================

export async function exportDatabase(): Promise<string> {
  const partners = await getAllPartners();
  const fieldConfigs = await getFieldConfigs();
  
  const data = {
    partners,
    fieldConfigs,
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
  return JSON.stringify(data, null, 2);
}

export async function importDatabase(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.partners) {
      for (const partner of data.partners) {
        await savePartner(partner);
      }
    }
    
    if (data.fieldConfigs) {
      await saveFieldConfigs(data.fieldConfigs);
    }
    
    toast.success("Dados importados com sucesso");
  } catch (error) {
    toast.error("Dados inválidos");
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

