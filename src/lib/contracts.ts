import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Contract, 
  NewContract, 
  ContractVersion, 
  NewContractVersion,
  ContractSigner,
  NewContractSigner,
  ContractStatus 
} from "@/types/contracts";

// ==================== CONTRACTS ====================

export async function listContracts(partnerId: string): Promise<Contract[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('partner_id', partnerId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      partnerId: row.partner_id,
      title: row.title,
      status: row.status as ContractStatus,
      contractValue: row.contract_value ? Number(row.contract_value) : undefined,
      currency: row.currency || 'BRL',
      startDate: row.start_date ? new Date(row.start_date) : undefined,
      endDate: row.end_date ? new Date(row.end_date) : undefined,
      autoRenew: row.auto_renew || false,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  } catch (error) {
    console.error("Error loading contracts:", error);
    toast.error("Erro ao carregar contratos");
    return [];
  }
}

export async function upsertContract(payload: NewContract & { id?: string }): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Usuário não autenticado");
      return null;
    }

    const contractData = {
      ...(payload.id && { id: payload.id }),
      user_id: user.id,
      partner_id: payload.partnerId,
      title: payload.title,
      status: payload.status || 'draft',
      contract_value: payload.contractValue,
      currency: payload.currency || 'BRL',
      start_date: payload.startDate?.toISOString().split('T')[0],
      end_date: payload.endDate?.toISOString().split('T')[0],
      auto_renew: payload.autoRenew ?? false,
    };

    const { data, error } = await supabase
      .from('contracts')
      .upsert(contractData)
      .select()
      .single();

    if (error) {
      console.error("Error upserting contract:", error);
      toast.error("Erro ao salvar contrato");
      return null;
    }

    toast.success(payload.id ? "Contrato atualizado" : "Contrato criado");
    return data.id;
  } catch (error) {
    console.error("Error in upsertContract:", error);
    toast.error("Erro ao salvar contrato");
    return null;
  }
}

export async function updateContractStatus(
  contractId: string, 
  status: ContractStatus
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contracts')
      .update({ status })
      .eq('id', contractId);

    if (error) {
      console.error("Error updating contract status:", error);
      toast.error("Erro ao atualizar status do contrato");
      return false;
    }

    toast.success("Status do contrato atualizado");
    return true;
  } catch (error) {
    console.error("Error in updateContractStatus:", error);
    toast.error("Erro ao atualizar status");
    return false;
  }
}

export async function deleteContract(contractId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', contractId);

    if (error) {
      console.error("Error deleting contract:", error);
      toast.error("Erro ao deletar contrato");
      return false;
    }

    toast.success("Contrato deletado");
    return true;
  } catch (error) {
    console.error("Error in deleteContract:", error);
    toast.error("Erro ao deletar contrato");
    return false;
  }
}

// ==================== CONTRACT VERSIONS ====================

export async function listContractVersions(contractId: string): Promise<ContractVersion[]> {
  try {
    const { data, error } = await supabase
      .from('contract_versions')
      .select('*')
      .eq('contract_id', contractId)
      .order('version_number', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      contractId: row.contract_id,
      versionNumber: row.version_number,
      storagePath: row.storage_path,
      notes: row.notes,
      createdAt: new Date(row.created_at),
    }));
  } catch (error) {
    console.error("Error loading contract versions:", error);
    toast.error("Erro ao carregar versões do contrato");
    return [];
  }
}

export async function addContractVersion(
  payload: NewContractVersion
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contract_versions')
      .insert({
        contract_id: payload.contractId,
        version_number: payload.versionNumber,
        storage_path: payload.storagePath,
        notes: payload.notes,
      });

    if (error) {
      console.error("Error adding contract version:", error);
      toast.error("Erro ao adicionar versão do contrato");
      return false;
    }

    toast.success("Versão do contrato adicionada");
    return true;
  } catch (error) {
    console.error("Error in addContractVersion:", error);
    toast.error("Erro ao adicionar versão");
    return false;
  }
}

// ==================== CONTRACT SIGNERS ====================

export async function listContractSigners(contractId: string): Promise<ContractSigner[]> {
  try {
    const { data, error } = await supabase
      .from('contract_signers')
      .select('*')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      contractId: row.contract_id,
      signerName: row.signer_name,
      signerEmail: row.signer_email,
      role: row.role,
      signedAt: row.signed_at ? new Date(row.signed_at) : undefined,
      createdAt: new Date(row.created_at),
    }));
  } catch (error) {
    console.error("Error loading contract signers:", error);
    toast.error("Erro ao carregar signatários");
    return [];
  }
}

export async function upsertSigner(
  payload: NewContractSigner & { id?: string }
): Promise<boolean> {
  try {
    const signerData = {
      ...(payload.id && { id: payload.id }),
      contract_id: payload.contractId,
      signer_name: payload.signerName,
      signer_email: payload.signerEmail,
      role: payload.role,
      signed_at: payload.signedAt?.toISOString(),
    };

    const { error } = await supabase
      .from('contract_signers')
      .upsert(signerData);

    if (error) {
      console.error("Error upserting signer:", error);
      toast.error("Erro ao salvar signatário");
      return false;
    }

    toast.success(payload.id ? "Signatário atualizado" : "Signatário adicionado");
    return true;
  } catch (error) {
    console.error("Error in upsertSigner:", error);
    toast.error("Erro ao salvar signatário");
    return false;
  }
}

export async function deleteSigner(signerId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contract_signers')
      .delete()
      .eq('id', signerId);

    if (error) {
      console.error("Error deleting signer:", error);
      toast.error("Erro ao deletar signatário");
      return false;
    }

    toast.success("Signatário removido");
    return true;
  } catch (error) {
    console.error("Error in deleteSigner:", error);
    toast.error("Erro ao deletar signatário");
    return false;
  }
}
