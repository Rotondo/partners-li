import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FieldConfig {
  id?: string;
  userId: string;
  config: Record<string, any>;
}

/**
 * Load field configurations for current user
 */
export async function loadFieldConfigs(): Promise<Record<string, any> | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No user authenticated, using default configs");
      return null;
    }

    const { data, error } = await supabase
      .from('field_configs')
      .select('config')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading field configs:", error);
      return null;
    }

    return (data?.config as Record<string, any>) || null;
  } catch (error) {
    console.error("Error in loadFieldConfigs:", error);
    return null;
  }
}

/**
 * Save field configurations for current user
 */
export async function saveFieldConfigs(config: Record<string, any>): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    const { error } = await supabase
      .from('field_configs')
      .upsert({
        user_id: user.id,
        config: config,
      });

    if (error) {
      console.error("Error saving field configs:", error);
      toast.error("Erro ao salvar configurações");
      return false;
    }

    toast.success("Configurações salvas com sucesso");
    return true;
  } catch (error) {
    console.error("Error in saveFieldConfigs:", error);
    toast.error("Erro ao salvar configurações");
    return false;
  }
}
