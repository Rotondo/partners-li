import { PaymentPartner } from '@/types/partner';

/**
 * Seed data com 5 parceiros de pagamento reais e completos
 *
 * Dados baseados em pesquisa de mercado (Janeiro 2025)
 * Estrutura granular para permitir comparação detalhada no dashboard
 */

export const paymentPartnersSeedData: Omit<PaymentPartner, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // 1. APP MAX
  {
    name: 'APP MAX',
    category: 'payment',
    categories: ['payment'],
    status: 'active',
    startDate: new Date('2024-01-15'),

    fees: {
      creditCard: {
        vista: {
          mdr: 2.99,
          description: 'Crédito à vista - melhor taxa do mercado'
        },
        installments2to6: {
          mdr: 4.49,
          description: 'Parcelado 2-6x'
        },
        installments7to12: {
          mdr: 5.99,
          description: 'Parcelado 7-12x'
        }
      },
      debitCard: {
        mdr: 1.99,
        description: 'Débito à vista'
      },
      pix: {
        mdr: 0.99,
        description: 'Pix - taxa mais competitiva'
      },
      anticipationRate: 1.99, // % ao mês
      chargebackFee: 0 // SEM taxa de chargeback!
    },

    settlement: {
      credit: 30,
      debit: 1,
      pix: 1
    },

    supportedMethods: ['credit', 'debit', 'pix', 'boleto'],

    takeRate: 2.99, // Taxa média para comparação

    competitiveAdvantages: [
      'Menor taxa de Pix do mercado (0,99%)',
      'SEM taxa de chargeback',
      'Liquidação D+1 para débito e Pix',
      'Taxa de antecipação mais baixa (1,99% a.m.)',
      'Interface simplificada e moderna'
    ],

    notes: 'Excelente para e-commerces com alto volume de Pix e débito. Custo-benefício excepcional.'
  },

  // 2. Pagar.me
  {
    name: 'Pagar.me',
    category: 'payment',
    categories: ['payment'],
    status: 'active',
    startDate: new Date('2023-08-20'),

    fees: {
      creditCard: {
        vista: {
          mdr: 3.79,
          description: 'Crédito à vista'
        },
        installments2to6: {
          mdr: 4.99,
          description: 'Parcelado 2-6x'
        },
        installments7to12: {
          mdr: 6.49,
          description: 'Parcelado 7-12x'
        }
      },
      debitCard: {
        mdr: 2.89,
        description: 'Débito à vista'
      },
      pix: {
        mdr: 1.49,
        description: 'Pix'
      },
      anticipationRate: 2.49,
      chargebackFee: 15.00
    },

    settlement: {
      credit: 30,
      debit: 1,
      pix: 1
    },

    supportedMethods: ['credit', 'debit', 'pix'],

    takeRate: 3.79,

    competitiveAdvantages: [
      'API bem documentada e fácil integração',
      'Dashboard com analytics avançados',
      'Split de pagamento automático',
      'Suporte técnico responsivo 24/7',
      'Marketplace de plugins e integrações'
    ],

    notes: 'Boa escolha para empresas que valorizam tecnologia e integração robusta. Taxas medianas.'
  },

  // 3. PagBank (PagSeguro)
  {
    name: 'PagBank',
    category: 'payment',
    categories: ['payment'],
    status: 'active',
    startDate: new Date('2023-03-10'),

    fees: {
      creditCard: {
        vista: {
          mdr: 3.99,
          description: 'Crédito à vista'
        },
        installments2to6: {
          mdr: 5.49,
          description: 'Parcelado 2-6x'
        },
        installments7to12: {
          mdr: 6.99,
          description: 'Parcelado 7-12x'
        }
      },
      debitCard: {
        mdr: 2.99,
        description: 'Débito à vista'
      },
      pix: {
        mdr: 1.99,
        description: 'Pix'
      },
      anticipationRate: 2.99,
      chargebackFee: 20.00
    },

    settlement: {
      credit: 30,
      debit: 1,
      pix: 1
    },

    supportedMethods: ['credit', 'debit', 'pix'],

    takeRate: 3.99,

    competitiveAdvantages: [
      'Marca consolidada no mercado (PagSeguro)',
      'Conta digital integrada',
      'Maquininha física disponível',
      'Proteção contra fraude inclusa',
      'Histórico de estabilidade operacional'
    ],

    notes: 'Solução completa para quem busca ecossistema financeiro integrado. Taxas um pouco acima da média.'
  },

  // 4. PagHiper
  {
    name: 'PagHiper',
    category: 'payment',
    categories: ['payment'],
    status: 'active',
    startDate: new Date('2024-02-01'),

    fees: {
      pix: {
        mdr: 0.99,
        description: 'Pix - especialidade da casa'
      },
      boleto: {
        mdr: 1.99,
        description: 'Boleto bancário'
      },
      anticipationRate: 0, // Não oferece antecipação
      chargebackFee: 0
    },

    settlement: {
      pix: 1,
      boleto: 1, // D+1 após compensação
      boletoCompensation: 2 // Boleto compensa em ~2 dias úteis
    },

    supportedMethods: ['pix', 'boleto'],

    takeRate: 1.49, // Média entre Pix e boleto

    competitiveAdvantages: [
      'ESPECIALISTA em Pix e Boleto',
      'Taxas extremamente competitivas',
      'SEM taxa de chargeback',
      'Ideal para empresas B2B',
      'Integração simplificada para boletos',
      'Geração automática de QR Codes Pix'
    ],

    notes: 'Melhor opção para empresas que trabalham principalmente com Pix e Boleto (B2B, serviços, assinaturas).'
  },

  // 5. PayPal
  {
    name: 'PayPal',
    category: 'payment',
    categories: ['payment'],
    status: 'active',
    startDate: new Date('2022-11-05'),

    fees: {
      creditCard: {
        national: {
          mdr: 4.99,
          fixedFee: 0.60,
          description: 'Cartão nacional - 4,99% + R$ 0,60 por transação'
        },
        international: {
          mdr: 6.99,
          fixedFee: 0.60,
          description: 'Cartão internacional - 6,99% + R$ 0,60'
        }
      },
      debitCard: {
        mdr: 3.99,
        fixedFee: 0.60,
        description: 'Débito - 3,99% + R$ 0,60'
      },
      anticipationRate: 0, // Não oferece antecipação tradicional
      chargebackFee: 35.00
    },

    settlement: {
      credit: 1,
      debit: 1
    },

    supportedMethods: ['credit', 'debit', 'international'],

    takeRate: 5.59, // 4.99 + 0.60 convertido para %

    competitiveAdvantages: [
      'Marca global reconhecida',
      'Suporte a pagamentos internacionais',
      'Proteção ao comprador e vendedor',
      'Liquidação rápida (D+1)',
      'Checkout simplificado (1-click)',
      'Ideal para marketplaces e e-commerces internacionais'
    ],

    notes: 'Melhor para e-commerces com vendas internacionais ou que valorizam a confiança da marca PayPal. Taxas mais altas, mas com liquidez imediata.'
  }
];

/**
 * Função para gerar IDs e timestamps nos parceiros
 */
export function generatePaymentPartnersWithIds(): PaymentPartner[] {
  const now = new Date();

  return paymentPartnersSeedData.map((partner) => ({
    ...partner,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now
  }));
}

/**
 * Sumário comparativo rápido para dashboard
 */
export const partnerComparison = {
  cheapestPix: 'APP MAX e PagHiper (0,99%)',
  cheapestCredit: 'APP MAX (2,99%)',
  cheapestDebit: 'APP MAX (1,99%)',
  noChargebackFee: ['APP MAX', 'PagHiper'],
  fastestSettlement: 'PayPal (D+1 para tudo)',
  bestForB2B: 'PagHiper',
  bestForInternational: 'PayPal',
  bestTechStack: 'Pagar.me',
  bestOverall: 'APP MAX (custo-benefício)',
  mostExpensive: 'PayPal (5,59% médio)'
};
