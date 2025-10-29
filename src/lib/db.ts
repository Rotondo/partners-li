import { Partner } from "@/types/partner";
import { FieldConfig, DEFAULT_FIELD_CONFIGS } from "@/types/field-config";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ==================== PARTNERS ====================

export async function savePartner(partner: Partner): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  // Determine primary category from categories array
  const primaryCategory = partner.categories[0] || 'logistic';

  const { error } = await supabase
    .from('partners')
    .upsert({
      id: partner.id,
      user_id: user.id,
      name: partner.name,
      type: primaryCategory,
      data: partner as any,
    }, { onConflict: 'id' });

  if (error) {
    toast.error("Erro ao salvar parceiro");
    throw error;
  }
}

export async function getAllPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
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
  
  toast.success("Dados removidos com sucesso");
}

