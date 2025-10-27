import { z } from "zod";

export const paymentMethodSchema = z.object({
  // Identificação
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  type: z.string().min(1, "Tipo é obrigatório"),
  startDate: z.date({
    required_error: "Data de início é obrigatória",
  }),
  status: z.enum(["Ativo", "Inativo", "Em Homologação", "Pausado", "Cancelado"]),
  
  // Estrutura de Taxas
  fees: z.object({
    mdrCreditVista: z.number().min(0, "Valor deve ser positivo").max(100, "Valor deve ser menor que 100%"),
    mdrDebit: z.number().min(0, "Valor deve ser positivo").max(100, "Valor deve ser menor que 100%"),
    mdrPix: z.number().min(0, "Valor deve ser positivo").max(100, "Valor deve ser menor que 100%"),
    anticipationRate: z.number().min(0, "Valor deve ser positivo").max(100, "Valor deve ser menor que 100%"),
    chargebackFee: z.number().min(0, "Valor deve ser positivo"),
  }),
  
  // Prazos de Repasse
  settlement: z.object({
    credit: z.number().int("Deve ser um número inteiro").min(0, "Valor deve ser positivo"),
    debit: z.number().int("Deve ser um número inteiro").min(0, "Valor deve ser positivo"),
    pix: z.number().int("Deve ser um número inteiro").min(0, "Valor deve ser positivo"),
  }),
  
  // Take Rate
  takeRate: z.number().min(0, "Valor deve ser positivo").max(100, "Valor deve ser menor que 100%"),
  
  // Indicadores de Performance
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
  
  // Observações
  observations: z.string().optional(),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
