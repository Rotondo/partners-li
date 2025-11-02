import { z } from "zod";

// 1. IDENTIFICAÇÃO
export const companyDataSchema = z.object({
  tradeName: z.string().min(1, "Nome comercial é obrigatório"),
  legalName: z.string().optional(),
  cnpj: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  solutionType: z.enum([
    "Adquirente",
    "Subadquirente",
    "Gateway de Pagamento",
    "PSP (Payment Service Provider)",
    "Facilitador",
    "Split de Pagamento",
    "Outro"
  ]),
  solutionTypeOther: z.string().optional(),
});

export const contactDataSchema = z.object({
  accountManager: z.string().optional(),
  businessEmail: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  supportChannel: z.string().optional(),
  responseSLA: z.string().optional(),
});

export const documentationLinksSchema = z.object({
  apiDocsUrl: z.string().url().optional().or(z.literal("")),
  publicFeesUrl: z.string().url().optional().or(z.literal("")),
  termsOfServiceUrl: z.string().url().optional().or(z.literal("")),
  lastFeesUpdate: z.date().optional(),
});

// 2. TAXAS
export const feeByRevenueSchema = z.object({
  id: z.string(),
  condition: z.string().min(1, "Condição é obrigatória"),
  baseRate: z.number().min(0).max(100),
  fixedFee: z.number().min(0).optional(),
  settlementDays: z.number().int().min(0),
});

export const installmentFeeSchema = z.object({
  installments: z.number().int().min(2).max(12),
  additionalRate: z.number().min(0).max(100),
  accumulatedRate: z.number().min(0).max(100),
});

export const creditCardFeesSchema = z.object({
  feesByRevenue: z.array(feeByRevenueSchema),
  additionalRatePerInstallment: z.number().min(0).max(100).optional(),
  maxInstallments: z.number().int().min(1).max(12),
  interestBearer: z.enum(["Lojista", "Comprador", "Dividido"]),
  interestPercentage: z.string().optional(),
  installmentTable: z.array(installmentFeeSchema),
  acceptedBrands: z.array(z.string()),
});

export const debitCardFeesSchema = z.object({
  baseRate: z.number().min(0).max(100),
  fixedFee: z.number().min(0).optional(),
  settlementDays: z.number().int().min(0),
  acceptedBrands: z.array(z.string()),
});

export const pixFeesSchema = z.object({
  baseRate: z.number().min(0).max(100),
  fixedFee: z.number().min(0).optional(),
  settlementDays: z.number().int().min(0),
  availability: z.enum(["Instantâneo", "D+0", "D+1", "D+X"]),
  availabilityDays: z.number().int().min(0).optional(),
});

export const boletoFeesSchema = z.object({
  baseRate: z.number().min(0).max(100),
  fixedFee: z.number().min(0).optional(),
  settlementDays: z.number().int().min(0),
  defaultDueDays: z.number().int().min(1),
  customDueDateAllowed: z.boolean(),
});

export const otherPaymentMethodSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  baseRate: z.number().min(0).max(100),
  fixedFee: z.number().min(0).optional(),
  settlementDays: z.number().int().min(0),
  notes: z.string().optional(),
});

export const minimumChargesSchema = z.object({
  pix: z.number().min(0).optional(),
  creditCard: z.number().min(0).optional(),
  debitCard: z.number().min(0).optional(),
  boleto: z.number().min(0).optional(),
});

export const receivablesAdvanceSchema = z.object({
  available: z.boolean(),
  advanceRate: z.number().min(0).max(100).optional(),
  defaultDays: z.number().int().min(0).optional(),
  advancedDays: z.number().int().min(0).optional(),
  type: z.enum(["Automática", "Sob Demanda", "Não Disponível"]).optional(),
});

export const withdrawalFeesSchema = z.object({
  feePerWithdrawal: z.number().min(0).optional(),
  minimumAmount: z.number().min(0).optional(),
  freeWithdrawalFrom: z.number().min(0).optional(),
  additionalFeePerTransaction: z.number().min(0).optional(),
  withdrawalLimitPerPeriod: z.string().optional(),
  notes: z.string().optional(),
});

// Novos schemas granulares
export const posFeesSchema = z.object({
  creditVista: z.number().min(0),
  creditInstallments: z.number().min(0),
  debit: z.number().min(0),
  pix: z.number().min(0),
  installmentTable: z.array(installmentFeeSchema).optional(),
  notes: z.string().optional(),
});

export const digitalAccountServicesSchema = z.object({
  monthlyFee: z.number().min(0).optional(),
  cardReissueFee: z.number().min(0).optional(),
  invoiceIssuanceFee: z.number().min(0).optional(),
  nationalPaymentsFee: z.number().min(0).optional(),
  internationalPaymentsFee: z.number().min(0).optional(),
  iofPercentage: z.number().min(0).max(100).optional(),
  hasCheckingAccount: z.boolean().optional(),
  hasCreditLine: z.boolean().optional(),
  notes: z.string().optional(),
});

export const atmWithdrawalFeesSchema = z.object({
  banco24HorasQR: z.number().min(0).optional(),
  debitCardNational: z.number().min(0).optional(),
  debitCardInternational: z.number().min(0).optional(),
  creditCardNational: z.number().min(0).optional(),
  creditCardInternational: z.number().min(0).optional(),
  iofPercentage: z.number().min(0).max(100).optional(),
  freeWithdrawalsPerMonth: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

export const depositFeesSchema = z.object({
  pix: z.number().min(0),
  ted: z.number().min(0),
  boleto: z.number().min(0),
  boletoFreeLimit: z.number().int().min(0).optional(),
  lottery: z.number().min(0),
  lotteryFreeLimit: z.number().int().min(0).optional(),
  virtualDebitCard: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const cryptoFeesSchema = z.object({
  buyRate: z.number().min(0).max(100),
  sellRate: z.number().min(0).max(100),
  minimumBuy: z.number().min(0),
  minimumSell: z.number().min(0),
  monthlyLimit: z.number().min(0).optional(),
  supportedCoins: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const checkoutPaymentMethodsSchema = z.object({
  mercadoPagoBalance: z.number().min(0).max(100).optional(),
  creditLine: z.number().min(0).max(100).optional(),
  openFinance: z.number().min(0).max(100).optional(),
  prepaidCard: z.number().min(0).max(100).optional(),
  bankSlip: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export const partnershipConditionsSchema = z.object({
  isExclusive: z.boolean(),
  partnerName: z.string().optional(),
  specialNotes: z.string().optional(),
  publicRatesUrl: z.string().url().optional().or(z.literal("")),
  partnerRatesUrl: z.string().url().optional().or(z.literal("")),
  discountPercentage: z.number().min(0).max(100).optional(),
  volumeRequired: z.string().optional(),
});

export const chargebackPolicySchema = z.object({
  feePerChargeback: z.number().min(0),
  hasGuarantee: z.boolean(),
  guaranteeConditions: z.string().optional(),
});

export const otherFeeSchema = z.object({
  id: z.string(),
  type: z.string().min(1, "Tipo é obrigatório"),
  amount: z.number().min(0),
  periodicity: z.string().optional(),
  notes: z.string().optional(),
});

// 3. PRAZOS E REPASSES
export const settlementTimelineSchema = z.object({
  creditCardDefault: z.number().int().min(0),
  creditCardAdvanced: z.number().int().min(0).optional(),
  creditCardParcelledDefault: z.number().int().min(0),
  creditCardParcelledAdvanced: z.number().int().min(0).optional(),
  debitCardDefault: z.number().int().min(0),
  debitCardAdvanced: z.number().int().min(0).optional(),
  pixDefault: z.number().int().min(0),
  pixAdvanced: z.number().int().min(0).optional(),
  boletoDefault: z.number().int().min(0),
  boletoAdvanced: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

export const platformSplitSchema = z.object({
  model: z.enum([
    "Percentual sobre MDR",
    "Valor Fixo por Transação",
    "Híbrido",
    "Outro"
  ]),
  modelOther: z.string().optional(),
  takeRatePercentage: z.number().min(0).max(100).optional(),
  fixedAmountPerTransaction: z.number().min(0).optional(),
  repaymentPeriodicity: z.string().optional(),
});

// 4. PERFORMANCE
export const approvalRateSchema = z.object({
  paymentMethod: z.string().min(1, "Meio de pagamento é obrigatório"),
  averageRate: z.number().min(0).max(100),
  source: z.string().optional(),
});

export const performanceIndicatorsSchema = z.object({
  approvalRates: z.array(approvalRateSchema),
  averageICP: z.number().min(0).max(100).optional(),
  marketBenchmarkICP: z.number().min(0).max(100).optional(),
  topRejectionReasons: z.array(z.string()).optional(),
});

// 5. INTEGRAÇÃO
export const integrationDetailsSchema = z.object({
  types: z.array(z.enum([
    "API REST",
    "SDK",
    "Plugin/Módulo Pronto",
    "Redirect/Hosted Page",
    "Outro"
  ])),
  typeOther: z.string().optional(),
  checkoutTypes: z.array(z.enum([
    "Checkout Transparente",
    "Checkout Redirect",
    "Checkout Lightbox",
    "Link de Pagamento"
  ])),
  hasFraudPrevention: z.boolean(),
  hasRiskScore: z.boolean(),
  has3DS: z.boolean(),
  hasTokenization: z.boolean(),
  isPCICompliant: z.boolean(),
  hasWebhooks: z.boolean(),
  webhookEvents: z.array(z.string()).optional(),
});

// 6. ONBOARDING
export const onboardingProcessSchema = z.object({
  averageApprovalTime: z.string().optional(),
  requiredDocuments: z.array(z.string()).optional(),
  requiresSSL: z.boolean(),
  hasSandbox: z.boolean(),
  apiCredentials: z.array(z.string()).optional(),
  integrationComplexity: z.enum([
    "Baixa (plug-and-play)",
    "Média (requer customização)",
    "Alta (desenvolvimento extenso)"
  ]),
});

// 7. SUPORTE
export const supportDetailsSchema = z.object({
  channels: z.array(z.string()),
  businessDays: z.string().optional(),
  businessHours: z.string().optional(),
  has24x7Support: z.boolean(),
  slaLevels: z.object({
    critical: z.string().optional(),
    high: z.string().optional(),
    medium: z.string().optional(),
    low: z.string().optional(),
  }).optional(),
});

// 8. COMPLIANCE
export const complianceDataSchema = z.object({
  certifications: z.array(z.string()),
  servesBrazilWide: z.boolean(),
  restrictedRegions: z.array(z.string()).optional(),
  restrictedSectors: z.array(z.string()).optional(),
});

// 9. OBSERVAÇÕES
export const strategicObservationsSchema = z.object({
  competitiveDifferentials: z.array(z.string()).optional(),
  knownLimitations: z.array(z.string()).optional(),
  recommendedUseCases: z.array(z.string()).optional(),
});

export const changeHistoryEntrySchema = z.object({
  id: z.string(),
  date: z.date(),
  changeType: z.string().min(1, "Tipo de alteração é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

// 10. AVALIAÇÃO
export const evaluationScoresSchema = z.object({
  costBenefit: z.number().min(0).max(10).optional(),
  integrationEase: z.number().min(0).max(10).optional(),
  approvalPerformance: z.number().min(0).max(10).optional(),
  support: z.number().min(0).max(10).optional(),
  documentation: z.number().min(0).max(10).optional(),
  reliability: z.number().min(0).max(10).optional(),
});

export const evaluationNotesSchema = z.object({
  costBenefit: z.string().optional(),
  integrationEase: z.string().optional(),
  approvalPerformance: z.string().optional(),
  support: z.string().optional(),
  documentation: z.string().optional(),
  reliability: z.string().optional(),
});

export const nextStepsSchema = z.object({
  steps: z.array(z.string()),
});

// METADADOS
export const recordMetadataSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().optional(),
  reviewedBy: z.string().optional(),
  nextReviewDate: z.date().optional(),
});

// SCHEMA PRINCIPAL
export const paymentMethodSchema = z.object({
  // Identificação
  company: companyDataSchema,
  contact: contactDataSchema.optional(),
  documentation: documentationLinksSchema.optional(),
  status: z.enum([
    "Ativo",
    "Em Teste (Pilot)",
    "Em Negociação",
    "Inativo",
    "Em Homologação",
    "Pausado",
    "Cancelado",
    "Descontinuado"
  ]),
  startDate: z.date({
    required_error: "Data de início é obrigatória",
  }),
  
  // Taxas
  creditCard: creditCardFeesSchema,
  debitCard: debitCardFeesSchema,
  pix: pixFeesSchema,
  boleto: boletoFeesSchema,
  otherPaymentMethods: z.array(otherPaymentMethodSchema).optional(),
  minimumCharges: minimumChargesSchema.optional(),
  receivablesAdvance: receivablesAdvanceSchema.optional(),
  withdrawal: withdrawalFeesSchema.optional(),
  chargeback: chargebackPolicySchema,
  otherFees: z.array(otherFeeSchema).optional(),
  
  // Prazos e Repasse
  settlement: settlementTimelineSchema,
  platformSplit: platformSplitSchema,
  
  // Performance
  performance: performanceIndicatorsSchema.optional(),
  
  // Integração
  integration: integrationDetailsSchema,
  
  // Onboarding
  onboarding: onboardingProcessSchema.optional(),
  
  // Suporte
  support: supportDetailsSchema.optional(),
  
  // Compliance
  compliance: complianceDataSchema.optional(),
  
  // Observações
  observations: strategicObservationsSchema.optional(),
  changeHistory: z.array(changeHistoryEntrySchema).optional(),
  
  // Avaliação
  status10: z.enum([
    "Ativo",
    "Em Teste (Pilot)",
    "Em Negociação",
    "Inativo",
    "Em Homologação",
    "Pausado",
    "Cancelado",
    "Descontinuado"
  ]),
  evaluationScores: evaluationScoresSchema.optional(),
  evaluationNotes: evaluationNotesSchema.optional(),
  nextSteps: nextStepsSchema.optional(),
  
  // Metadados
  metadata: recordMetadataSchema,
  
  // Novos campos granulares
  posFees: posFeesSchema.optional(),
  digitalAccount: digitalAccountServicesSchema.optional(),
  atmWithdrawal: atmWithdrawalFeesSchema.optional(),
  deposits: depositFeesSchema.optional(),
  crypto: cryptoFeesSchema.optional(),
  checkoutMethods: checkoutPaymentMethodsSchema.optional(),
  partnershipConditions: partnershipConditionsSchema.optional(),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
