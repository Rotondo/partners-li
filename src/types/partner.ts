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
  customFields?: Record<string, any>; // Campos personalizados configuráveis
  contactFields?: Record<string, any>; // Campos de contato personalizados
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

// Estrutura granular de taxas por método de pagamento
export interface PaymentMethodFees {
  mdr?: number; // Taxa percentual (MDR)
  fixedFee?: number; // Taxa fixa por transação (ex: R$ 0,60)
  description?: string; // Descrição adicional
}

// Dados específicos de Pagamento (ESTRUTURA EXPANDIDA)
export interface PaymentPartnerData {
  category: 'payment';

  // Taxas detalhadas por método
  fees: {
    // Crédito
    creditCard?: {
      vista?: PaymentMethodFees; // À vista
      installments2to6?: PaymentMethodFees; // 2-6 parcelas
      installments7to12?: PaymentMethodFees; // 7-12 parcelas
      national?: PaymentMethodFees; // Nacional (para gateways internacionais)
      international?: PaymentMethodFees; // Internacional
    };

    // Débito
    debitCard?: PaymentMethodFees;

    // Pix
    pix?: PaymentMethodFees;

    // Boleto
    boleto?: PaymentMethodFees;

    // Outras taxas
    anticipationRate?: number; // Taxa de antecipação (% ao mês)
    chargebackFee?: number; // Taxa de chargeback (valor fixo)
  };

  // Prazos de liquidação (dias)
  settlement: {
    credit?: number; // Crédito
    debit?: number; // Débito
    pix?: number; // Pix
    boleto?: number; // Boleto (após compensação)
    boletoCompensation?: number; // Dias para compensar boleto
  };

  // Métodos suportados
  supportedMethods: ('credit' | 'debit' | 'pix' | 'boleto' | 'international')[];

  // Taxa média combinada (para comparação rápida)
  takeRate: number;

  // Performance histórica (opcional)
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

  // Diferenciais competitivos
  competitiveAdvantages?: string[];

  // Observações importantes
  notes?: string;
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

