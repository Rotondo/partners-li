import { Partner, PartnerCategory } from '@/types/partner';

export interface ComparatorAttribute {
  id: string;
  label: string;
  type: 'text' | 'number' | 'percentage' | 'date' | 'badge' | 'tags' | 'boolean' | 'currency' | 'days';
  category: 'shared' | 'logistic' | 'payment' | 'marketplace';
  getValue: (partner: Partner) => any;
  format?: (value: any) => string;
  highlight?: 'lower' | 'higher'; // Para destacar melhor/pior valor
}

export const COMPARATOR_ATTRIBUTES: ComparatorAttribute[] = [
  // Atributos compartilhados
  {
    id: 'name',
    label: 'Nome',
    type: 'text',
    category: 'shared',
    getValue: (p) => p.name,
  },
  {
    id: 'status',
    label: 'Status',
    type: 'badge',
    category: 'shared',
    getValue: (p) => p.status,
  },
  {
    id: 'startDate',
    label: 'Data de Início',
    type: 'date',
    category: 'shared',
    getValue: (p) => p.startDate,
  },
  {
    id: 'isImportant',
    label: 'Prioritário',
    type: 'boolean',
    category: 'shared',
    getValue: (p) => p.isImportant,
  },
  {
    id: 'priorityRank',
    label: 'Ranking',
    type: 'number',
    category: 'shared',
    getValue: (p) => p.priorityRank,
    highlight: 'lower',
  },

  // Atributos de Logística
  {
    id: 'logistic.coverage',
    label: 'Cobertura',
    type: 'tags',
    category: 'logistic',
    getValue: (p) => p.logistic?.coverage,
  },
  {
    id: 'logistic.deliveryTime',
    label: 'Prazo de Entrega (dias)',
    type: 'days',
    category: 'logistic',
    getValue: (p) => p.logistic?.deliveryTime,
    highlight: 'lower',
  },
  {
    id: 'logistic.capacity',
    label: 'Capacidade Diária',
    type: 'number',
    category: 'logistic',
    getValue: (p) => p.logistic?.capacity,
    highlight: 'higher',
  },
  {
    id: 'logistic.pricingModel',
    label: 'Modelo de Preço',
    type: 'badge',
    category: 'logistic',
    getValue: (p) => p.logistic?.pricingModel,
  },
  {
    id: 'logistic.integrationType',
    label: 'Tipo de Integração',
    type: 'badge',
    category: 'logistic',
    getValue: (p) => p.logistic?.integrationType,
  },

  // Atributos de Pagamento
  {
    id: 'payment.takeRate',
    label: 'Taxa Geral (Take Rate)',
    type: 'percentage',
    category: 'payment',
    getValue: (p) => p.payment?.takeRate,
    highlight: 'lower',
  },
  {
    id: 'payment.fees.pix.mdr',
    label: 'Taxa Pix (MDR)',
    type: 'percentage',
    category: 'payment',
    getValue: (p) => p.payment?.fees?.pix?.mdr,
    highlight: 'lower',
  },
  {
    id: 'payment.fees.pix.fixedFee',
    label: 'Taxa Fixa Pix',
    type: 'currency',
    category: 'payment',
    getValue: (p) => p.payment?.fees?.pix?.fixedFee,
    highlight: 'lower',
  },
  {
    id: 'payment.fees.creditCard.vista.mdr',
    label: 'Taxa Crédito à Vista',
    type: 'percentage',
    category: 'payment',
    getValue: (p) => p.payment?.fees?.creditCard?.vista?.mdr,
    highlight: 'lower',
  },
  {
    id: 'payment.fees.debitCard.mdr',
    label: 'Taxa Débito',
    type: 'percentage',
    category: 'payment',
    getValue: (p) => p.payment?.fees?.debitCard?.mdr,
    highlight: 'lower',
  },
  {
    id: 'payment.fees.boleto.fixedFee',
    label: 'Taxa Boleto',
    type: 'currency',
    category: 'payment',
    getValue: (p) => p.payment?.fees?.boleto?.fixedFee,
    highlight: 'lower',
  },
  {
    id: 'payment.settlement.pix',
    label: 'Liquidação Pix (dias)',
    type: 'days',
    category: 'payment',
    getValue: (p) => p.payment?.settlement?.pix,
    highlight: 'lower',
  },
  {
    id: 'payment.settlement.credit',
    label: 'Liquidação Crédito (dias)',
    type: 'days',
    category: 'payment',
    getValue: (p) => p.payment?.settlement?.credit,
    highlight: 'lower',
  },
  {
    id: 'payment.settlement.debit',
    label: 'Liquidação Débito (dias)',
    type: 'days',
    category: 'payment',
    getValue: (p) => p.payment?.settlement?.debit,
    highlight: 'lower',
  },
  {
    id: 'payment.fees.chargebackFee',
    label: 'Taxa de Chargeback',
    type: 'currency',
    category: 'payment',
    getValue: (p) => p.payment?.fees?.chargebackFee,
    highlight: 'lower',
  },
  {
    id: 'payment.fees.anticipationRate',
    label: 'Taxa de Antecipação',
    type: 'percentage',
    category: 'payment',
    getValue: (p) => p.payment?.fees?.anticipationRate,
    highlight: 'lower',
  },

  // Atributos de Marketplace
  {
    id: 'marketplace.commission',
    label: 'Comissão',
    type: 'percentage',
    category: 'marketplace',
    getValue: (p) => p.marketplace?.commission,
    highlight: 'lower',
  },
  {
    id: 'marketplace.monthlyReach',
    label: 'Alcance Mensal',
    type: 'number',
    category: 'marketplace',
    getValue: (p) => p.marketplace?.monthlyReach,
    highlight: 'higher',
  },
  {
    id: 'marketplace.supportedCategories',
    label: 'Categorias Suportadas',
    type: 'tags',
    category: 'marketplace',
    getValue: (p) => p.marketplace?.supportedCategories,
  },
  {
    id: 'marketplace.avgConversionRate',
    label: 'Taxa de Conversão Média',
    type: 'percentage',
    category: 'marketplace',
    getValue: (p) => p.marketplace?.avgConversionRate,
    highlight: 'higher',
  },
  {
    id: 'marketplace.integrationType',
    label: 'Tipo de Integração',
    type: 'badge',
    category: 'marketplace',
    getValue: (p) => p.marketplace?.integrationType,
  },
];

// Função helper para obter atributos baseado na categoria
export function getAttributesByCategory(category: PartnerCategory | 'all'): ComparatorAttribute[] {
  if (category === 'all') {
    return COMPARATOR_ATTRIBUTES.filter(attr => attr.category === 'shared');
  }

  const categoryMap: Record<PartnerCategory, ('shared' | PartnerCategory)[]> = {
    logistic: ['shared', 'logistic'],
    payment: ['shared', 'payment'],
    marketplace: ['shared', 'marketplace'],
  };

  return COMPARATOR_ATTRIBUTES.filter(attr => 
    categoryMap[category]?.includes(attr.category as any)
  );
}

// Atributos padrão para cada categoria
export const DEFAULT_ATTRIBUTES_BY_CATEGORY: Record<PartnerCategory | 'all', string[]> = {
  all: ['name', 'status', 'startDate'],
  logistic: ['name', 'status', 'logistic.coverage', 'logistic.deliveryTime', 'logistic.pricingModel'],
  payment: ['name', 'status', 'payment.takeRate', 'payment.fees.pix.mdr', 'payment.fees.creditCard.vista.mdr', 'payment.settlement.pix'],
  marketplace: ['name', 'status', 'marketplace.commission', 'marketplace.monthlyReach', 'marketplace.avgConversionRate'],
};
