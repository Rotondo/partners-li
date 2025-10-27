import { z } from "zod";

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
  
  // Observações
  notes: z.string().optional(),
});

export type PartnerFormData = z.infer<typeof partnerSchema>;

