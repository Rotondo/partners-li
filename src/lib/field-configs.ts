import { toast } from "sonner";
import { ldbGetJson, ldbSetJson } from "./local-db";

export interface FieldConfig {
  id?: string;
  userId: string;
  config: Record<string, any>;
}

export async function loadFieldConfigs(): Promise<Record<string, any> | null> {
  return ldbGetJson<Record<string, any> | null>('field_configs_remote', null);
}

export async function saveFieldConfigs(config: Record<string, any>): Promise<boolean> {
  try {
    ldbSetJson('field_configs_remote', config);
    toast.success("Configurações salvas com sucesso");
    return true;
  } catch (error) {
    console.error("Error in saveFieldConfigs:", error);
    toast.error("Erro ao salvar configurações");
    return false;
  }
}
