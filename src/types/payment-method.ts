export type PaymentMethodStatus = 
  | "Ativo" 
  | "Inativo" 
  | "Em Homologação" 
  | "Pausado" 
  | "Cancelado";

export interface PaymentType {
  id: string;
  name: string;
}

export interface MonthlyPerformance {
  approval: number;
  gmv: number;
  transactions: number;
}

export interface PaymentMethod {
  id: string;
  // Identificação
  name: string;
  type: string;
  startDate: Date;
  status: PaymentMethodStatus;
  
  // Estrutura de Taxas
  fees: {
    mdrCreditVista: number;
    mdrDebit: number;
    mdrPix: number;
    anticipationRate: number;
    chargebackFee: number;
  };
  
  // Prazos de Repasse
  settlement: {
    credit: number;
    debit: number;
    pix: number;
  };
  
  // Take Rate
  takeRate: number;
  
  // Indicadores de Performance
  performance: {
    month1: MonthlyPerformance;
    month2: MonthlyPerformance;
    month3: MonthlyPerformance;
  };
  
  // Meios de Pagamento Aceitos
  acceptedPaymentMethods: {
    creditCard: {
      enabled: boolean;
      brands: string[];
    };
    debitCard: {
      enabled: boolean;
      brands: string[];
    };
    pix: {
      enabled: boolean;
      normal: boolean;
      installment: boolean;
    };
    boleto: boolean;
    digitalWallet: {
      enabled: boolean;
      wallets: string[];
    };
    bnpl: boolean;
  };
  
  // Antifraude (opcional)
  antiFraud?: {
    solution: string;
    minScore: number;
  };
  
  // Observações
  observations?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_PAYMENT_TYPES: PaymentType[] = [
  { id: "1", name: "Adquirente" },
  { id: "2", name: "Subadquirente" },
  { id: "3", name: "Gateway" },
  { id: "4", name: "PSP" },
  { id: "5", name: "Split" },
];

export const CARD_BRANDS = [
  "Visa",
  "Mastercard",
  "Elo",
  "Amex",
  "Hipercard",
  "Diners",
];

export const DIGITAL_WALLETS = [
  "PicPay",
  "PagBank",
  "Mercado Pago",
  "PayPal",
  "Google Pay",
  "Apple Pay",
];
