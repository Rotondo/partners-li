import { toast } from "sonner";
import {
  Contract,
  NewContract,
  ContractVersion,
  NewContractVersion,
  ContractSigner,
  NewContractSigner,
  ContractStatus,
} from "@/types/contracts";
import { ldbGetAll, ldbSetAll, ldbFind, ldbDelete } from "./local-db";

const LOCAL_USER_ID = 'local';

// ==================== CONTRACTS ====================

export async function listContracts(partnerId: string): Promise<Contract[]> {
  const rows = ldbFind<any>('contracts', (r: any) => r.partner_id === partnerId);
  rows.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return rows.map((row: any) => ({
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
}

export async function upsertContract(payload: NewContract & { id?: string }): Promise<string | null> {
  try {
    const now = new Date().toISOString();
    const all = ldbGetAll<any>('contracts');
    const id = payload.id || crypto.randomUUID();
    const idx = all.findIndex((r: any) => r.id === id);
    const record = {
      id,
      user_id: LOCAL_USER_ID,
      partner_id: payload.partnerId,
      title: payload.title,
      status: payload.status || 'draft',
      contract_value: payload.contractValue,
      currency: payload.currency || 'BRL',
      start_date: payload.startDate?.toISOString().split('T')[0],
      end_date: payload.endDate?.toISOString().split('T')[0],
      auto_renew: payload.autoRenew ?? false,
      created_at: idx >= 0 ? all[idx].created_at : now,
      updated_at: now,
    };
    if (idx >= 0) {
      all[idx] = record;
    } else {
      all.unshift(record);
    }
    ldbSetAll('contracts', all);
    toast.success(payload.id ? "Contrato atualizado" : "Contrato criado");
    return id;
  } catch (error) {
    console.error("Error in upsertContract:", error);
    toast.error("Erro ao salvar contrato");
    return null;
  }
}

export async function updateContractStatus(contractId: string, status: ContractStatus): Promise<boolean> {
  try {
    const all = ldbGetAll<any>('contracts');
    const idx = all.findIndex((r: any) => r.id === contractId);
    if (idx < 0) return false;
    all[idx] = { ...all[idx], status, updated_at: new Date().toISOString() };
    ldbSetAll('contracts', all);
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
    ldbDelete('contracts', contractId);
    // Also delete related versions and signers
    const versions = ldbGetAll<any>('contract_versions').filter((r: any) => r.contract_id !== contractId);
    ldbSetAll('contract_versions', versions);
    const signers = ldbGetAll<any>('contract_signers').filter((r: any) => r.contract_id !== contractId);
    ldbSetAll('contract_signers', signers);
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
  const rows = ldbFind<any>('contract_versions', (r: any) => r.contract_id === contractId);
  rows.sort((a: any, b: any) => b.version_number - a.version_number);
  return rows.map((row: any) => ({
    id: row.id,
    contractId: row.contract_id,
    versionNumber: row.version_number,
    storagePath: row.storage_path,
    notes: row.notes,
    createdAt: new Date(row.created_at),
  }));
}

export async function addContractVersion(payload: NewContractVersion): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    const all = ldbGetAll<any>('contract_versions');
    all.unshift({
      id: crypto.randomUUID(),
      contract_id: payload.contractId,
      version_number: payload.versionNumber,
      storage_path: payload.storagePath,
      notes: payload.notes,
      created_at: now,
    });
    ldbSetAll('contract_versions', all);
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
  const rows = ldbFind<any>('contract_signers', (r: any) => r.contract_id === contractId);
  rows.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  return rows.map((row: any) => ({
    id: row.id,
    contractId: row.contract_id,
    signerName: row.signer_name,
    signerEmail: row.signer_email,
    role: row.role,
    signedAt: row.signed_at ? new Date(row.signed_at) : undefined,
    createdAt: new Date(row.created_at),
  }));
}

export async function upsertSigner(payload: NewContractSigner & { id?: string }): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    const all = ldbGetAll<any>('contract_signers');
    const id = payload.id || crypto.randomUUID();
    const idx = all.findIndex((r: any) => r.id === id);
    const record = {
      id,
      contract_id: payload.contractId,
      signer_name: payload.signerName,
      signer_email: payload.signerEmail,
      role: payload.role,
      signed_at: payload.signedAt?.toISOString(),
      created_at: idx >= 0 ? all[idx].created_at : now,
      updated_at: now,
    };
    if (idx >= 0) {
      all[idx] = record;
    } else {
      all.unshift(record);
    }
    ldbSetAll('contract_signers', all);
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
    ldbDelete('contract_signers', signerId);
    toast.success("Signatário removido");
    return true;
  } catch (error) {
    console.error("Error in deleteSigner:", error);
    toast.error("Erro ao deletar signatário");
    return false;
  }
}
