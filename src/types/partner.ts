export type PartnerCategory = 'logistic' | 'payment' | 'marketplace';

export type PartnerStatus = 'active' | 'inactive' | 'pending' | 'paused';

// Dados compartilhados por todos os parceiros
export interface SharedPartnerData {
  id: string;
  name: string;
  categories: PartnerCategory[]; // Um parceiro pode ter múltiplas categorias
  status: PartnerStatus;
  startDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dados específicos de Logística
export interface LogisticPartnerData {
  category: 'logistic';
  coverage: string[]; // Estados/regiões atendidas
  deliveryTime: number; // dias úteis para entrega
  capacity: number; // volume diário de encomendas
  pricingModel: 'fixed' | 'variable'; // modelo de preço
  integrationType: 'api' | 'manual'; // tipo de integração
}

// Dados específicos de Pagamento
export interface PaymentPartnerData {
  category: 'payment';
  fees: {
    mdrCreditVista: number;
    mdrDebit: number;
    mdrPix: number;
    anticipationRate: number;
    chargebackFee: number;
  };
  settlement: {
    credit: number;
    debit: number;
    pix: number;
  };
  takeRate: number;
  performance?: {
    month1: {
      approval: number;
      gmv: number;
      transactions: number;
    };
    month2: {
      approval: number;
      gmv: number;
      transactions: number;
    };
    month3: {
      approval: number;
      gmv: number;
      transactions: number;
    };
  };
}

// Dados específicos de Marketplace
export interface MarketplacePartnerData {
  category: 'marketplace';
  commission: number; // % de comissão
  supportedCategories: string[]; // categorias de produtos
  monthlyReach: number; // usuários únicos mensais
  integrationType: 'api' | 'manual';
  avgConversionRate?: number; // taxa de conversão média
}

// Parceiro completo com dados compartilhados + dados específicos
export interface Partner extends SharedPartnerData {
  logistic?: LogisticPartnerData;
  payment?: PaymentPartnerData;
  marketplace?: MarketplacePartnerData;
}

// Compatibilidade com tipos antigos
export type LogisticPartner = SharedPartnerData & LogisticPartnerData;
export type PaymentPartner = SharedPartnerData & PaymentPartnerData;
export type MarketplacePartner = SharedPartnerData & MarketplacePartnerData;

// Tipos auxiliares
export const LOGISTIC_COVERAGE_OPTIONS = [
  'SP', 'RJ', 'MG', 'PR', 'RS', 'SC', 'DF', 'GO', 'BA', 'CE', 
  'PE', 'PR', 'ES', 'PB', 'MT', 'MS', 'RN', 'AL', 'SE', 'MA'
];

export const MARKETPLACE_CATEGORIES = [
  'Eletrônicos',
  'Roupas e Acessórios',
  'Casa e Jardim',
  'Beleza e Perfumaria',
  'Esportes e Fitness',
  'Livros e Mídia',
  'Brinquedos',
  'Alimentos e Bebidas',
  'Automotivo',
  'Outros'
];

