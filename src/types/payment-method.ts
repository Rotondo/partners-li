export type PaymentMethodStatus = 
  | "Ativo" 
  | "Em Teste (Pilot)"
  | "Em Negociação"
  | "Inativo" 
  | "Em Homologação" 
  | "Pausado" 
  | "Cancelado"
  | "Descontinuado";

export type SolutionType = 
  | "Adquirente"
  | "Subadquirente"
  | "Gateway de Pagamento"
  | "PSP (Payment Service Provider)"
  | "Facilitador"
  | "Split de Pagamento"
  | "Outro";

export type IntegrationType = "API REST" | "SDK" | "Plugin/Módulo Pronto" | "Redirect/Hosted Page" | "Outro";
export type CheckoutType = "Checkout Transparente" | "Checkout Redirect" | "Checkout Lightbox" | "Link de Pagamento";
export type AntecipationType = "Automática" | "Sob Demanda" | "Não Disponível";
export type InterestBearerType = "Lojista" | "Comprador" | "Dividido";

// 1. IDENTIFICAÇÃO DO PARCEIRO
export interface CompanyData {
  tradeName: string; // Nome Comercial
  legalName?: string; // Razão Social
  cnpj?: string;
  website?: string;
  solutionType: SolutionType;
  solutionTypeOther?: string; // Se "Outro"
}

export interface ContactData {
  accountManager?: string;
  businessEmail?: string;
  phone?: string;
  supportChannel?: string;
  responseSLA?: string;
}

export interface DocumentationLinks {
  apiDocsUrl?: string;
  publicFeesUrl?: string;
  termsOfServiceUrl?: string;
  lastFeesUpdate?: Date;
}

// 2. MODELO DE TAXAS E CUSTOS
export interface FeeByRevenue {
  id: string;
  condition: string; // Ex: "Faturamento > R$ 100k"
  baseRate: number; // %
  fixedFee?: number; // R$
  settlementDays: number; // D+X
}

export interface InstallmentFee {
  installments: number; // 2x, 3x, etc
  additionalRate: number; // % adicional
  accumulatedRate: number; // % acumulada total
}

export interface CreditCardFees {
  feesByRevenue: FeeByRevenue[];
  additionalRatePerInstallment?: number; // % por parcela
  maxInstallments: number;
  interestBearer: InterestBearerType;
  interestPercentage?: string; // Descrição do percentual
  installmentTable: InstallmentFee[]; // Tabela 2x-12x
  acceptedBrands: string[];
}

export interface DebitCardFees {
  baseRate: number; // %
  fixedFee?: number; // R$
  settlementDays: number; // D+X
  acceptedBrands: string[];
}

export interface PixFees {
  baseRate: number; // %
  fixedFee?: number; // R$
  settlementDays: number; // D+X
  availability: "Instantâneo" | "D+0" | "D+1" | "D+X";
  availabilityDays?: number; // Se D+X
}

export interface BoletoFees {
  baseRate: number; // %
  fixedFee?: number; // R$
  settlementDays: number; // D+X
  defaultDueDays: number; // Prazo padrão de vencimento
  customDueDateAllowed: boolean;
}

export interface OtherPaymentMethod {
  id: string;
  name: string; // Ex: "Carteira Digital (PicPay)"
  baseRate: number;
  fixedFee?: number;
  settlementDays: number;
  notes?: string;
}

export interface MinimumCharges {
  pix?: number; // R$
  creditCard?: number; // R$
  debitCard?: number; // R$
  boleto?: number; // R$
}

export interface ReceivablesAdvance {
  available: boolean;
  advanceRate?: number; // % taxa
  defaultDays?: number; // Prazo padrão
  advancedDays?: number; // Prazo com antecipação
  type?: AntecipationType;
}

export interface WithdrawalFees {
  feePerWithdrawal?: number; // R$
  minimumAmount?: number; // R$
  freeWithdrawalFrom?: number; // R$ - saque gratuito a partir de
  additionalFeePerTransaction?: number; // R$
  withdrawalLimitPerPeriod?: string; // Ex: "5 por mês"
}

export interface ChargebackPolicy {
  feePerChargeback: number; // R$
  hasGuarantee: boolean;
  guaranteeConditions?: string;
}

export interface OtherFee {
  id: string;
  type: string; // Ex: "Mensalidade", "Setup/Ativação"
  amount: number; // R$
  periodicity?: string; // Ex: "Mensal", "Única"
  notes?: string;
}

// 3. PRAZOS E REPASSES
export interface SettlementTimeline {
  creditCardDefault: number; // D+X
  creditCardAdvanced?: number;
  creditCardParcelledDefault: number;
  creditCardParcelledAdvanced?: number;
  debitCardDefault: number;
  debitCardAdvanced?: number;
  pixDefault: number;
  pixAdvanced?: number;
  boletoDefault: number;
  boletoAdvanced?: number;
  notes?: string;
}

export interface PlatformSplit {
  model: "Percentual sobre MDR" | "Valor Fixo por Transação" | "Híbrido" | "Outro";
  modelOther?: string;
  takeRatePercentage?: number; // %
  fixedAmountPerTransaction?: number; // R$
  repaymentPeriodicity?: string; // Ex: "Semanal", "Mensal"
}

// 4. PERFORMANCE E INDICADORES
export interface ApprovalRate {
  paymentMethod: string; // Ex: "Crédito", "Débito"
  averageRate: number; // %
  source?: string; // Fonte/Período
}

export interface PerformanceIndicators {
  approvalRates: ApprovalRate[];
  averageICP?: number; // % Índice de Conversão de Pedidos
  marketBenchmarkICP?: number; // %
  topRejectionReasons?: string[]; // Motivos mais comuns
}

// 5. INTEGRAÇÃO E TECNOLOGIA
export interface IntegrationDetails {
  types: IntegrationType[];
  typeOther?: string;
  checkoutTypes: CheckoutType[];
  hasFraudPrevention: boolean;
  hasRiskScore: boolean;
  has3DS: boolean; // 3D Secure
  hasTokenization: boolean;
  isPCICompliant: boolean;
  hasWebhooks: boolean;
  webhookEvents?: string[]; // Ex: ["Pagamento Aprovado", "Chargeback"]
}

// 6. ONBOARDING E CADASTRAMENTO
export interface OnboardingProcess {
  averageApprovalTime?: string; // Ex: "3-5 dias úteis"
  requiredDocuments?: string[]; // Ex: ["CNPJ", "Contrato Social"]
  requiresSSL: boolean;
  hasSandbox: boolean;
  apiCredentials?: string[]; // Ex: ["Public Key", "Secret Key"]
  integrationComplexity: "Baixa (plug-and-play)" | "Média (requer customização)" | "Alta (desenvolvimento extenso)";
}

// 7. SUPORTE E SLA
export interface SupportDetails {
  channels: string[]; // Ex: ["Chat Online", "E-mail", "Telefone"]
  businessDays?: string;
  businessHours?: string;
  has24x7Support: boolean;
  slaLevels?: {
    critical?: string;
    high?: string;
    medium?: string;
    low?: string;
  };
}

// 8. COMPLIANCE E REGULAÇÃO
export interface ComplianceData {
  certifications: string[]; // Ex: ["PCI-DSS", "ISO 27001"]
  servesBrazilWide: boolean;
  restrictedRegions?: string[];
  restrictedSectors?: string[]; // Ex: ["Dropshipping", "Adult Content"]
}

// 9. OBSERVAÇÕES E PARTICULARIDADES
export interface StrategicObservations {
  competitiveDifferentials?: string[]; // Diferenciais competitivos
  knownLimitations?: string[]; // Limitações conhecidas
  recommendedUseCases?: string[]; // Casos de uso recomendados
}

export interface ChangeHistoryEntry {
  id: string;
  date: Date;
  changeType: string; // Ex: "Alteração de Taxa", "Novo Meio de Pagamento"
  description: string;
}

// 10. DECISÃO ESTRATÉGICA
export interface EvaluationScores {
  costBenefit?: number; // 0-10
  integrationEase?: number; // 0-10
  approvalPerformance?: number; // 0-10
  support?: number; // 0-10
  documentation?: number; // 0-10
  reliability?: number; // 0-10
}

export interface EvaluationNotes {
  costBenefit?: string;
  integrationEase?: string;
  approvalPerformance?: string;
  support?: string;
  documentation?: string;
  reliability?: string;
}

export interface NextSteps {
  steps: string[]; // Ex: ["Concluir integração técnica"]
}

// METADADOS
export interface RecordMetadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  reviewedBy?: string;
  nextReviewDate?: Date;
}

// INTERFACE PRINCIPAL
export interface PaymentMethod {
  id: string;
  
  // Identificação
  company: CompanyData;
  contact?: ContactData;
  documentation?: DocumentationLinks;
  status: PaymentMethodStatus;
  startDate: Date;
  
  // Taxas
  creditCard: CreditCardFees;
  debitCard: DebitCardFees;
  pix: PixFees;
  boleto: BoletoFees;
  otherPaymentMethods?: OtherPaymentMethod[];
  minimumCharges?: MinimumCharges;
  receivablesAdvance?: ReceivablesAdvance;
  withdrawal?: WithdrawalFees;
  chargeback: ChargebackPolicy;
  otherFees?: OtherFee[];
  
  // Prazos e Repasse
  settlement: SettlementTimeline;
  platformSplit: PlatformSplit;
  
  // Performance
  performance?: PerformanceIndicators;
  
  // Integração
  integration: IntegrationDetails;
  
  // Onboarding
  onboarding?: OnboardingProcess;
  
  // Suporte
  support?: SupportDetails;
  
  // Compliance
  compliance?: ComplianceData;
  
  // Observações
  observations?: StrategicObservations;
  changeHistory?: ChangeHistoryEntry[];
  
  // Avaliação
  status10: PaymentMethodStatus;
  evaluationScores?: EvaluationScores;
  evaluationNotes?: EvaluationNotes;
  nextSteps?: NextSteps;
  
  // Metadados
  metadata: RecordMetadata;
}

// Constantes
export const SOLUTION_TYPES: SolutionType[] = [
  "Adquirente",
  "Subadquirente",
  "Gateway de Pagamento",
  "PSP (Payment Service Provider)",
  "Facilitador",
  "Split de Pagamento",
  "Outro"
];

export const CARD_BRANDS = [
  "Visa",
  "Mastercard",
  "Elo",
  "Hipercard",
  "Amex",
  "Diners"
];

export const DIGITAL_WALLETS = [
  "PicPay",
  "PagBank",
  "Mercado Pago",
  "PayPal",
  "Google Pay",
  "Apple Pay"
];

export const INTEGRATION_TYPES: IntegrationType[] = [
  "API REST",
  "SDK",
  "Plugin/Módulo Pronto",
  "Redirect/Hosted Page",
  "Outro"
];

export const CHECKOUT_TYPES: CheckoutType[] = [
  "Checkout Transparente",
  "Checkout Redirect",
  "Checkout Lightbox",
  "Link de Pagamento"
];

export const SUPPORT_CHANNELS = [
  "Chat Online",
  "E-mail",
  "Telefone",
  "WhatsApp",
  "Portal de Tickets",
  "Gerente de Conta Dedicado"
];

export const CERTIFICATIONS = [
  "PCI-DSS",
  "ISO 27001",
  "LGPD Compliant",
  "Banco Central (Instituição de Pagamento)"
];

export const RESTRICTED_SECTORS = [
  "Dropshipping",
  "Infoprodutos",
  "Suplementos",
  "Adult Content",
  "Criptomoedas"
];

export const WEBHOOK_EVENTS = [
  "Pagamento Aprovado",
  "Pagamento Recusado",
  "Chargeback",
  "Reembolso",
  "Estorno"
];
