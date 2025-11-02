import { z } from "zod";
import { LOGISTIC_COVERAGE_OPTIONS, MARKETPLACE_CATEGORIES } from "@/types/partner";

// ==================== SHARED SCHEMAS ====================

// Schema base compartilhado por todos os parceiros
export const sharedPartnerSchema = z.object({
  // Identificação
  name: z.string().min(1, "Nome é obrigatório").max(200, "Nome muito longo"),
  startDate: z.date({
    required_error: "Data de início é obrigatória",
  }),
  status: z.enum(["active", "inactive", "pending", "paused"], {
    errorMap: () => ({ message: "Status inválido" }),
  }),
  categories: z.array(z.enum(["logistic", "payment", "marketplace"])).min(1, "Selecione pelo menos uma categoria"),
  notes: z.string().max(5000, "Observações muito longas").optional(),
});

// ==================== LOGISTIC PARTNER SCHEMA ====================

export const logisticPartnerDataSchema = z.object({
  category: z.literal("logistic"),
  coverage: z.array(z.enum(LOGISTIC_COVERAGE_OPTIONS as [string, ...string[]])).min(1, "Selecione pelo menos uma região"),
  deliveryTime: z.number().int().min(1, "Prazo mínimo é 1 dia").max(365, "Prazo máximo é 365 dias"),
  capacity: z.number().int().min(1, "Capacidade deve ser maior que zero"),
  pricingModel: z.enum(["fixed", "variable"], {
    errorMap: () => ({ message: "Modelo de preço inválido" }),
  }),
  integrationType: z.enum(["api", "manual"], {
    errorMap: () => ({ message: "Tipo de integração inválido" }),
  }),
});

export const logisticPartnerSchema = sharedPartnerSchema.extend({
  logistic: logisticPartnerDataSchema,
});

// ==================== PAYMENT PARTNER SCHEMA ====================

export const paymentPartnerDataSchema = z.object({
  category: z.literal("payment"),

  // Estrutura de Taxas
  fees: z.object({
    mdrCreditVista: z.number().min(0, "Taxa não pode ser negativa").max(100, "Taxa não pode exceder 100%"),
    mdrDebit: z.number().min(0, "Taxa não pode ser negativa").max(100, "Taxa não pode exceder 100%"),
    mdrPix: z.number().min(0, "Taxa não pode ser negativa").max(100, "Taxa não pode exceder 100%"),
    anticipationRate: z.number().min(0, "Taxa não pode ser negativa").max(100, "Taxa não pode exceder 100%"),
    chargebackFee: z.number().min(0, "Taxa não pode ser negativa"),
  }),

  // Prazos de Repasse
  settlement: z.object({
    credit: z.number().int().min(0, "Prazo não pode ser negativo").max(365, "Prazo máximo é 365 dias"),
    debit: z.number().int().min(0, "Prazo não pode ser negativo").max(365, "Prazo máximo é 365 dias"),
    pix: z.number().int().min(0, "Prazo não pode ser negativo").max(365, "Prazo máximo é 365 dias"),
  }),

  // Take Rate
  takeRate: z.number().min(0, "Take rate não pode ser negativo").max(100, "Take rate não pode exceder 100%"),

  // Indicadores de Performance (últimos 3 meses) - Opcional
  performance: z.object({
    month1: z.object({
      approval: z.number().min(0, "Aprovação não pode ser negativa").max(100, "Aprovação não pode exceder 100%"),
      gmv: z.number().min(0, "GMV não pode ser negativo"),
      transactions: z.number().int().min(0, "Transações não podem ser negativas"),
    }),
    month2: z.object({
      approval: z.number().min(0, "Aprovação não pode ser negativa").max(100, "Aprovação não pode exceder 100%"),
      gmv: z.number().min(0, "GMV não pode ser negativo"),
      transactions: z.number().int().min(0, "Transações não podem ser negativas"),
    }),
    month3: z.object({
      approval: z.number().min(0, "Aprovação não pode ser negativa").max(100, "Aprovação não pode exceder 100%"),
      gmv: z.number().min(0, "GMV não pode ser negativo"),
      transactions: z.number().int().min(0, "Transações não podem ser negativas"),
    }),
  }).optional(),
});

export const paymentPartnerSchema = sharedPartnerSchema.extend({
  payment: paymentPartnerDataSchema,
});

// Schema legado para compatibilidade com AddPartnerDialog existente
export const partnerSchema = z.object({
  // Identificação
  name: z.string().min(1, "Nome é obrigatório"),
  startDate: z.date({
    required_error: "Data de início é obrigatória",
  }),
  status: z.enum(["active", "inactive", "pending", "paused"]),

  // Estrutura de Taxas
  fees: z.object({
    mdrCreditVista: z.number().min(0).max(100),
    mdrDebit: z.number().min(0).max(100),
    mdrPix: z.number().min(0).max(100),
    anticipationRate: z.number().min(0).max(100),
    chargebackFee: z.number().min(0),
  }),

  // Prazos de Repasse
  settlement: z.object({
    credit: z.number().int().min(0),
    debit: z.number().int().min(0),
    pix: z.number().int().min(0),
  }),

  // Take Rate
  takeRate: z.number().min(0).max(100),

  // Indicadores de Performance (últimos 3 meses)
  performance: z.object({
    month1: z.object({
      approval: z.number().min(0).max(100),
      gmv: z.number().min(0),
      transactions: z.number().int().min(0),
    }),
    month2: z.object({
      approval: z.number().min(0).max(100),
      gmv: z.number().min(0),
      transactions: z.number().int().min(0),
    }),
    month3: z.object({
      approval: z.number().min(0).max(100),
      gmv: z.number().min(0),
      transactions: z.number().int().min(0),
    }),
  }),

  // Meios de Pagamento Aceitos
  acceptedPaymentMethods: z.object({
    creditCard: z.object({
      enabled: z.boolean(),
      brands: z.array(z.string()),
    }),
    debitCard: z.object({
      enabled: z.boolean(),
      brands: z.array(z.string()),
    }),
    pix: z.object({
      enabled: z.boolean(),
      normal: z.boolean(),
      installment: z.boolean(),
    }),
    boleto: z.boolean(),
    digitalWallet: z.object({
      enabled: z.boolean(),
      wallets: z.array(z.string()),
    }),
    bnpl: z.boolean(),
  }),

  // Antifraude (opcional)
  antiFraud: z.object({
    solution: z.string(),
    minScore: z.number().min(0).max(100),
  }).optional(),

  // Priorização e Análise Pareto (opcional)
  isImportant: z.boolean().optional(),
  priorityRank: z.number().int().min(1).optional(),
  paretoFocus: z.enum(["gmv", "rebate"]).optional(),

  // Observações
  notes: z.string().optional(),
});

// ==================== MARKETPLACE PARTNER SCHEMA ====================

export const marketplacePartnerDataSchema = z.object({
  category: z.literal("marketplace"),
  commission: z.number().min(0, "Comissão não pode ser negativa").max(100, "Comissão não pode exceder 100%"),
  supportedCategories: z.array(
    z.enum(MARKETPLACE_CATEGORIES as [string, ...string[]])
  ).min(1, "Selecione pelo menos uma categoria de produtos"),
  monthlyReach: z.number().int().min(0, "Alcance mensal não pode ser negativo"),
  integrationType: z.enum(["api", "manual"], {
    errorMap: () => ({ message: "Tipo de integração inválido" }),
  }),
  avgConversionRate: z.number().min(0, "Taxa de conversão não pode ser negativa").max(100, "Taxa não pode exceder 100%").optional(),
});

export const marketplacePartnerSchema = sharedPartnerSchema.extend({
  marketplace: marketplacePartnerDataSchema,
});

// ==================== DISCRIMINATED UNION SCHEMA ====================

// Schema que valida baseado na categoria selecionada
export const fullPartnerSchema = z.discriminatedUnion("primaryCategory", [
  z.object({
    primaryCategory: z.literal("logistic"),
    ...sharedPartnerSchema.shape,
    logistic: logisticPartnerDataSchema,
  }),
  z.object({
    primaryCategory: z.literal("payment"),
    ...sharedPartnerSchema.shape,
    payment: paymentPartnerDataSchema,
  }),
  z.object({
    primaryCategory: z.literal("marketplace"),
    ...sharedPartnerSchema.shape,
    marketplace: marketplacePartnerDataSchema,
  }),
]);

// ==================== FORM SCHEMAS (para criação de novos parceiros) ====================

// Schema para formulário de criação de parceiro logístico
export const createLogisticPartnerFormSchema = sharedPartnerSchema.merge(
  z.object({
    coverage: logisticPartnerDataSchema.shape.coverage,
    deliveryTime: logisticPartnerDataSchema.shape.deliveryTime,
    capacity: logisticPartnerDataSchema.shape.capacity,
    pricingModel: logisticPartnerDataSchema.shape.pricingModel,
    integrationType: logisticPartnerDataSchema.shape.integrationType,
  })
);

// Schema para formulário de criação de parceiro de pagamento
export const createPaymentPartnerFormSchema = sharedPartnerSchema.merge(
  z.object({
    fees: paymentPartnerDataSchema.shape.fees,
    settlement: paymentPartnerDataSchema.shape.settlement,
    takeRate: paymentPartnerDataSchema.shape.takeRate,
    performance: paymentPartnerDataSchema.shape.performance,
  })
);

// Schema para formulário de criação de parceiro marketplace
export const createMarketplacePartnerFormSchema = sharedPartnerSchema.merge(
  z.object({
    commission: marketplacePartnerDataSchema.shape.commission,
    supportedCategories: marketplacePartnerDataSchema.shape.supportedCategories,
    monthlyReach: marketplacePartnerDataSchema.shape.monthlyReach,
    integrationType: marketplacePartnerDataSchema.shape.integrationType,
    avgConversionRate: marketplacePartnerDataSchema.shape.avgConversionRate,
  })
);

// ==================== TYPE EXPORTS ====================

// Tipos inferidos dos schemas
export type SharedPartnerFormData = z.infer<typeof sharedPartnerSchema>;
export type LogisticPartnerFormData = z.infer<typeof createLogisticPartnerFormSchema>;
export type PaymentPartnerFormData = z.infer<typeof createPaymentPartnerFormSchema>;
export type MarketplacePartnerFormData = z.infer<typeof createMarketplacePartnerFormSchema>;
export type FullPartnerFormData = z.infer<typeof fullPartnerSchema>;

// Tipo legado para compatibilidade
export type PartnerFormData = z.infer<typeof partnerSchema>;

// ==================== VALIDATION HELPERS ====================

/**
 * Valida um parceiro baseado em suas categorias
 * @param partner - Dados do parceiro a validar
 * @returns Resultado da validação com erros detalhados
 */
export function validatePartner(partner: any) {
  // Determina qual schema usar baseado nas categorias
  const categories = partner.categories || [];

  const results = {
    isValid: true,
    errors: [] as string[],
  };

  // Valida campos compartilhados
  const sharedResult = sharedPartnerSchema.safeParse(partner);
  if (!sharedResult.success) {
    results.isValid = false;
    results.errors.push(...sharedResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`));
  }

  // Valida campos específicos por categoria
  if (categories.includes('logistic') && partner.logistic) {
    const logisticResult = logisticPartnerDataSchema.safeParse(partner.logistic);
    if (!logisticResult.success) {
      results.isValid = false;
      results.errors.push(...logisticResult.error.errors.map(e => `logistic.${e.path.join('.')}: ${e.message}`));
    }
  }

  if (categories.includes('payment') && partner.payment) {
    const paymentResult = paymentPartnerDataSchema.safeParse(partner.payment);
    if (!paymentResult.success) {
      results.isValid = false;
      results.errors.push(...paymentResult.error.errors.map(e => `payment.${e.path.join('.')}: ${e.message}`));
    }
  }

  if (categories.includes('marketplace') && partner.marketplace) {
    const marketplaceResult = marketplacePartnerDataSchema.safeParse(partner.marketplace);
    if (!marketplaceResult.success) {
      results.isValid = false;
      results.errors.push(...marketplaceResult.error.errors.map(e => `marketplace.${e.path.join('.')}: ${e.message}`));
    }
  }

  return results;
}

/**
 * Valida dados específicos de um tipo de parceiro
 * @param type - Tipo do parceiro ('logistic' | 'payment' | 'marketplace')
 * @param data - Dados a validar
 * @returns Resultado da validação
 */
export function validatePartnerData(type: 'logistic' | 'payment' | 'marketplace', data: any) {
  switch (type) {
    case 'logistic':
      return logisticPartnerDataSchema.safeParse({ ...data, category: 'logistic' });
    case 'payment':
      return paymentPartnerDataSchema.safeParse({ ...data, category: 'payment' });
    case 'marketplace':
      return marketplacePartnerDataSchema.safeParse({ ...data, category: 'marketplace' });
    default:
      return { success: false, error: { message: 'Tipo de parceiro inválido' } };
  }
}
