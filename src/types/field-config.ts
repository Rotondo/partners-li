export type PartnerType = 'logistic' | 'payment' | 'marketplace';

export interface FieldConfig {
  id: string;
  label: string;
  category: string;
  partnerType: PartnerType; // Para qual tipo de parceiro esse campo é
  enabled: boolean;
  required: boolean;
  order: number;
}

// Campos para LOGÍSTICO
export const LOGISTIC_FIELDS: FieldConfig[] = [
  // Campos compartilhados
  { id: 'name', label: 'Nome do Parceiro', category: 'identification', partnerType: 'logistic', enabled: true, required: true, order: 1 },
  { id: 'startDate', label: 'Data de Início', category: 'identification', partnerType: 'logistic', enabled: true, required: true, order: 2 },
  { id: 'status', label: 'Status', category: 'identification', partnerType: 'logistic', enabled: true, required: true, order: 3 },
  
  // Campos específicos de logística
  { id: 'coverage', label: 'Cobertura (Estados)', category: 'coverage', partnerType: 'logistic', enabled: true, required: true, order: 4 },
  { id: 'deliveryTime', label: 'Prazo de Entrega (dias)', category: 'delivery', partnerType: 'logistic', enabled: true, required: true, order: 5 },
  { id: 'capacity', label: 'Capacidade Diária', category: 'capacity', partnerType: 'logistic', enabled: true, required: true, order: 6 },
  { id: 'pricingModel', label: 'Modelo de Preço', category: 'pricing', partnerType: 'logistic', enabled: true, required: true, order: 7 },
  { id: 'integrationType', label: 'Tipo de Integração', category: 'integration', partnerType: 'logistic', enabled: true, required: false, order: 8 },
  { id: 'notes', label: 'Observações', category: 'observations', partnerType: 'logistic', enabled: true, required: false, order: 9 },
];

// Campos para PAGAMENTO
export const PAYMENT_FIELDS: FieldConfig[] = [
  // Campos compartilhados
  { id: 'name', label: 'Nome do Parceiro', category: 'identification', partnerType: 'payment', enabled: true, required: true, order: 1 },
  { id: 'startDate', label: 'Data de Início', category: 'identification', partnerType: 'payment', enabled: true, required: true, order: 2 },
  { id: 'status', label: 'Status', category: 'identification', partnerType: 'payment', enabled: true, required: true, order: 3 },
  
  // Taxas
  { id: 'mdrCreditVista', label: 'MDR Crédito à Vista', category: 'fees', partnerType: 'payment', enabled: true, required: true, order: 1 },
  { id: 'mdrDebit', label: 'MDR Débito', category: 'fees', partnerType: 'payment', enabled: true, required: true, order: 2 },
  { id: 'mdrPix', label: 'MDR Pix', category: 'fees', partnerType: 'payment', enabled: true, required: true, order: 3 },
  { id: 'anticipationRate', label: 'Taxa Antecipação', category: 'fees', partnerType: 'payment', enabled: true, required: true, order: 4 },
  { id: 'chargebackFee', label: 'Taxa Chargeback', category: 'fees', partnerType: 'payment', enabled: true, required: true, order: 5 },
  
  // Prazos
  { id: 'settlementCredit', label: 'Liquidação Crédito', category: 'settlement', partnerType: 'payment', enabled: true, required: true, order: 1 },
  { id: 'settlementDebit', label: 'Liquidação Débito', category: 'settlement', partnerType: 'payment', enabled: true, required: true, order: 2 },
  { id: 'settlementPix', label: 'Liquidação Pix', category: 'settlement', partnerType: 'payment', enabled: true, required: true, order: 3 },
  
  // Take Rate
  { id: 'takeRate', label: 'Take Rate', category: 'takeRate', partnerType: 'payment', enabled: true, required: true, order: 1 },
  
  // Performance
  { id: 'performance', label: 'Indicadores de Performance', category: 'performance', partnerType: 'payment', enabled: true, required: false, order: 1 },
  
  // Meios de Pagamento
  { id: 'acceptedPaymentMethods', label: 'Meios de Pagamento Aceitos', category: 'paymentTypes', partnerType: 'payment', enabled: true, required: false, order: 1 },
  
  // Antifraude
  { id: 'antiFraud', label: 'Antifraude', category: 'antiFraud', partnerType: 'payment', enabled: true, required: false, order: 1 },
  
  // Observações
  { id: 'notes', label: 'Observações', category: 'observations', partnerType: 'payment', enabled: true, required: false, order: 1 },
];

// Campos para MARKETPLACE
export const MARKETPLACE_FIELDS: FieldConfig[] = [
  // Campos compartilhados
  { id: 'name', label: 'Nome do Marketplace', category: 'identification', partnerType: 'marketplace', enabled: true, required: true, order: 1 },
  { id: 'startDate', label: 'Data de Início', category: 'identification', partnerType: 'marketplace', enabled: true, required: true, order: 2 },
  { id: 'status', label: 'Status', category: 'identification', partnerType: 'marketplace', enabled: true, required: true, order: 3 },
  
  // Campos específicos de marketplace
  { id: 'commission', label: 'Comissão (%)', category: 'commission', partnerType: 'marketplace', enabled: true, required: true, order: 4 },
  { id: 'supportedCategories', label: 'Categorias Suportadas', category: 'categories', partnerType: 'marketplace', enabled: true, required: false, order: 5 },
  { id: 'monthlyReach', label: 'Alcance Mensal', category: 'reach', partnerType: 'marketplace', enabled: true, required: false, order: 6 },
  { id: 'integrationType', label: 'Tipo de Integração', category: 'integration', partnerType: 'marketplace', enabled: true, required: true, order: 7 },
  { id: 'avgConversionRate', label: 'Taxa de Conversão', category: 'conversion', partnerType: 'marketplace', enabled: true, required: false, order: 8 },
  { id: 'notes', label: 'Observações', category: 'observations', partnerType: 'marketplace', enabled: true, required: false, order: 9 },
];

export const DEFAULT_FIELD_CONFIGS: FieldConfig[] = [
  ...LOGISTIC_FIELDS,
  ...PAYMENT_FIELDS,
  ...MARKETPLACE_FIELDS,
];

export type FieldCategory = FieldConfig['category'];

