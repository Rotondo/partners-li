// Types for contract management (legal/jurídico)

export type ContractStatus = 
  | 'draft'
  | 'under_review'
  | 'awaiting_signature'
  | 'active'
  | 'expired'
  | 'cancelled';

export interface Contract {
  id: string;
  userId: string;
  partnerId: string;
  title: string;
  status: ContractStatus;
  contractValue?: number;
  currency: string;
  startDate?: Date;
  endDate?: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewContract {
  partnerId: string;
  title: string;
  status?: ContractStatus;
  contractValue?: number;
  currency?: string;
  startDate?: Date;
  endDate?: Date;
  autoRenew?: boolean;
}

export interface ContractVersion {
  id: string;
  contractId: string;
  versionNumber: number;
  storagePath: string;
  notes?: string;
  createdAt: Date;
}

export interface NewContractVersion {
  contractId: string;
  versionNumber: number;
  storagePath: string;
  notes?: string;
}

export interface ContractSigner {
  id: string;
  contractId: string;
  signerName: string;
  signerEmail?: string;
  role?: string;
  signedAt?: Date;
  createdAt: Date;
}

export interface NewContractSigner {
  contractId: string;
  signerName: string;
  signerEmail?: string;
  role?: string;
  signedAt?: Date;
}

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  draft: 'Rascunho',
  under_review: 'Em Revisão',
  awaiting_signature: 'Aguardando Assinatura',
  active: 'Ativo',
  expired: 'Expirado',
  cancelled: 'Cancelado',
};

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
  draft: 'text-gray-600 bg-gray-100',
  under_review: 'text-yellow-600 bg-yellow-100',
  awaiting_signature: 'text-blue-600 bg-blue-100',
  active: 'text-green-600 bg-green-100',
  expired: 'text-orange-600 bg-orange-100',
  cancelled: 'text-red-600 bg-red-100',
};
