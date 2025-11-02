import { PaymentMethod } from "@/types/payment-method";

export function generatePaymentMethodsWithIds(): PaymentMethod[] {
  const now = new Date();
  
  return [
    // 1. MERCADO PAGO
    {
      id: crypto.randomUUID(),
      company: {
        tradeName: "Mercado Pago",
        legalName: "Mercado Pago Instituição de Pagamento Ltda.",
        cnpj: "10.573.521/0001-91",
        website: "https://www.mercadopago.com.br",
        solutionType: "PSP (Payment Service Provider)",
      },
      contact: {
        accountManager: "Equipe Comercial MP",
        businessEmail: "comercial@mercadopago.com",
        phone: "0800 275 0000",
        supportChannel: "Chat Online, E-mail, Telefone",
        responseSLA: "24h úteis",
      },
      documentation: {
        apiDocsUrl: "https://www.mercadopago.com.br/developers/pt/docs",
        publicFeesUrl: "https://www.mercadopago.com.br/custo/online",
        termsOfServiceUrl: "https://www.mercadopago.com.br/termos-e-condicoes",
        lastFeesUpdate: new Date("2024-01-15"),
      },
      status: "Ativo",
      startDate: new Date("2023-06-01"),
      
      // E-commerce
      creditCard: {
        feesByRevenue: [
          { id: "1", condition: "Padrão", baseRate: 4.99, settlementDays: 30 },
        ],
        maxInstallments: 12,
        interestBearer: "Lojista",
        installmentTable: [
          { installments: 2, additionalRate: 3.32, accumulatedRate: 8.31 },
          { installments: 3, additionalRate: 4.45, accumulatedRate: 9.44 },
          { installments: 4, additionalRate: 5.58, accumulatedRate: 10.57 },
          { installments: 5, additionalRate: 6.71, accumulatedRate: 11.70 },
          { installments: 6, additionalRate: 7.84, accumulatedRate: 12.83 },
          { installments: 7, additionalRate: 8.98, accumulatedRate: 13.97 },
          { installments: 8, additionalRate: 10.11, accumulatedRate: 15.10 },
          { installments: 9, additionalRate: 11.24, accumulatedRate: 16.23 },
          { installments: 10, additionalRate: 12.37, accumulatedRate: 17.36 },
          { installments: 11, additionalRate: 13.51, accumulatedRate: 18.50 },
          { installments: 12, additionalRate: 14.64, accumulatedRate: 19.63 },
        ],
        acceptedBrands: ["Visa", "Mastercard", "Elo", "Hipercard", "Amex", "Diners"],
      },
      debitCard: {
        baseRate: 3.49,
        settlementDays: 1,
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      pix: {
        baseRate: 0.99,
        settlementDays: 0,
        availability: "Instantâneo",
      },
      boleto: {
        baseRate: 0,
        fixedFee: 3.49,
        settlementDays: 2,
        defaultDueDays: 3,
        customDueDateAllowed: true,
      },
      
      // Maquininha (Point)
      posFees: {
        creditVista: 2.39,
        creditInstallments: 3.99,
        debit: 1.99,
        pix: 0.99,
        installmentTable: [
          { installments: 2, additionalRate: 1.60, accumulatedRate: 5.59 },
          { installments: 3, additionalRate: 2.14, accumulatedRate: 6.13 },
          { installments: 4, additionalRate: 2.68, accumulatedRate: 6.67 },
          { installments: 5, additionalRate: 3.22, accumulatedRate: 7.21 },
          { installments: 6, additionalRate: 3.76, accumulatedRate: 7.75 },
          { installments: 7, additionalRate: 4.31, accumulatedRate: 8.30 },
          { installments: 8, additionalRate: 4.85, accumulatedRate: 8.84 },
          { installments: 9, additionalRate: 5.39, accumulatedRate: 9.38 },
          { installments: 10, additionalRate: 5.93, accumulatedRate: 9.92 },
          { installments: 11, additionalRate: 6.48, accumulatedRate: 10.47 },
          { installments: 12, additionalRate: 7.02, accumulatedRate: 11.01 },
        ],
        notes: "Taxas do Mercado Pago Point (maquininha)",
      },
      
      // Checkout Mercado Pago
      checkoutMethods: {
        mercadoPagoBalance: 0,
        creditLine: 5.99,
        openFinance: 0.99,
        prepaidCard: 3.49,
        notes: "Meios exclusivos do Checkout Mercado Pago",
      },
      
      // Conta Digital
      digitalAccount: {
        monthlyFee: 0,
        cardReissueFee: 10.00,
        invoiceIssuanceFee: 0,
        nationalPaymentsFee: 0,
        internationalPaymentsFee: 6.38,
        iofPercentage: 5.38,
        hasCheckingAccount: true,
        hasCreditLine: true,
        notes: "Conta gratuita com cartão Mastercard internacional",
      },
      
      // Saques
      atmWithdrawal: {
        banco24HorasQR: 0,
        debitCardNational: 0,
        debitCardInternational: 11.50,
        creditCardNational: 11.50,
        creditCardInternational: 14.90,
        iofPercentage: 6.38,
        freeWithdrawalsPerMonth: 3,
        notes: "3 saques gratuitos/mês no Banco24Horas via QR Code",
      },
      
      // Depósitos
      deposits: {
        pix: 0,
        ted: 0,
        boleto: 0,
        boletoFreeLimit: 5,
        lottery: 2.99,
        lotteryFreeLimit: 2,
        virtualDebitCard: 0,
        notes: "5 boletos e 2 depósitos em lotérica gratuitos/mês",
      },
      
      // Criptomoedas
      crypto: {
        buyRate: 1.00,
        sellRate: 1.00,
        minimumBuy: 1.00,
        minimumSell: 1.00,
        monthlyLimit: 25000,
        supportedCoins: ["BTC", "ETH", "USDC"],
        notes: "Compra e venda com taxa fixa de 1%",
      },
      
      chargeback: {
        feePerChargeback: 20.00,
        hasGuarantee: false,
      },
      settlement: {
        creditCardDefault: 30,
        creditCardParcelledDefault: 30,
        debitCardDefault: 1,
        pixDefault: 0,
        boletoDefault: 2,
      },
      platformSplit: {
        model: "Percentual sobre MDR",
        takeRatePercentage: 0,
      },
      integration: {
        types: ["API REST", "SDK"],
        checkoutTypes: ["Checkout Transparente", "Checkout Redirect"],
        hasFraudPrevention: true,
        hasRiskScore: true,
        has3DS: true,
        hasTokenization: true,
        isPCICompliant: true,
        hasWebhooks: true,
        webhookEvents: ["Pagamento Aprovado", "Pagamento Recusado", "Chargeback", "Reembolso"],
      },
      status10: "Ativo",
      metadata: { createdAt: now, updatedAt: now },
    },

    // 2. APP MAX
    {
      id: crypto.randomUUID(),
      company: {
        tradeName: "APP MAX",
        legalName: "APP MAX Instituição de Pagamento S.A.",
        website: "https://appmax.com.br",
        solutionType: "Subadquirente",
      },
      status: "Ativo",
      startDate: new Date("2023-08-01"),
      
      creditCard: {
        feesByRevenue: [
          { id: "1", condition: "Até R$ 30k/mês", baseRate: 3.99, settlementDays: 30 },
          { id: "2", condition: "R$ 30k - R$ 100k/mês", baseRate: 3.79, settlementDays: 30 },
          { id: "3", condition: "R$ 100k - R$ 300k/mês", baseRate: 3.59, settlementDays: 30 },
          { id: "4", condition: "Acima de R$ 300k/mês", baseRate: 3.39, settlementDays: 30 },
        ],
        maxInstallments: 12,
        interestBearer: "Lojista",
        installmentTable: [
          { installments: 2, additionalRate: 0.50, accumulatedRate: 4.49 },
          { installments: 3, additionalRate: 0.70, accumulatedRate: 4.69 },
          { installments: 4, additionalRate: 0.90, accumulatedRate: 4.89 },
          { installments: 5, additionalRate: 1.10, accumulatedRate: 5.09 },
          { installments: 6, additionalRate: 1.30, accumulatedRate: 5.29 },
        ],
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      debitCard: {
        baseRate: 2.49,
        settlementDays: 1,
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      pix: {
        baseRate: 0.69,
        settlementDays: 0,
        availability: "Instantâneo",
      },
      boleto: {
        baseRate: 0,
        fixedFee: 2.99,
        settlementDays: 1,
        defaultDueDays: 3,
        customDueDateAllowed: true,
      },
      minimumCharges: {
        pix: 0.30,
        creditCard: 0.50,
        debitCard: 0.40,
        boleto: 2.99,
      },
      withdrawal: {
        feePerWithdrawal: 3.50,
        minimumAmount: 10.00,
        freeWithdrawalFrom: 100.00,
        notes: "Saque gratuito para valores acima de R$ 100",
      },
      atmWithdrawal: {
        debitCardNational: 6.90,
        notes: "Taxa fixa por saque no débito",
      },
      chargeback: {
        feePerChargeback: 25.00,
        hasGuarantee: false,
      },
      settlement: {
        creditCardDefault: 30,
        creditCardParcelledDefault: 30,
        debitCardDefault: 1,
        pixDefault: 0,
        boletoDefault: 1,
      },
      platformSplit: {
        model: "Percentual sobre MDR",
      },
      integration: {
        types: ["API REST"],
        checkoutTypes: ["Checkout Transparente"],
        hasFraudPrevention: true,
        hasRiskScore: false,
        has3DS: false,
        hasTokenization: true,
        isPCICompliant: true,
        hasWebhooks: true,
      },
      status10: "Ativo",
      metadata: { createdAt: now, updatedAt: now },
    },

    // 3. PAGAR.ME (Loja Integrada)
    {
      id: crypto.randomUUID(),
      company: {
        tradeName: "Pagar.me",
        legalName: "Pagar.me Instituição de Pagamento S.A.",
        website: "https://pagar.me",
        solutionType: "Gateway de Pagamento",
      },
      status: "Ativo",
      startDate: new Date("2023-05-01"),
      
      partnershipConditions: {
        isExclusive: true,
        partnerName: "Loja Integrada",
        publicRatesUrl: "https://pagar.me/precos",
        partnerRatesUrl: "https://lojaintegrada.com.br/pagarme",
        discountPercentage: 40,
        specialNotes: "Condições exclusivas para clientes Loja Integrada com 40% de desconto",
      },
      
      creditCard: {
        feesByRevenue: [
          { id: "1", condition: "Loja Integrada", baseRate: 3.39, settlementDays: 14 },
          { id: "2", condition: "Público geral", baseRate: 5.49, settlementDays: 30 },
        ],
        maxInstallments: 12,
        interestBearer: "Lojista",
        installmentTable: [
          { installments: 2, additionalRate: 1.99, accumulatedRate: 5.38 },
          { installments: 3, additionalRate: 2.49, accumulatedRate: 5.88 },
          { installments: 6, additionalRate: 3.99, accumulatedRate: 7.38 },
          { installments: 12, additionalRate: 6.99, accumulatedRate: 10.38 },
        ],
        acceptedBrands: ["Visa", "Mastercard", "Elo", "Hipercard", "Amex"],
      },
      debitCard: {
        baseRate: 2.39,
        settlementDays: 1,
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      pix: {
        baseRate: 0.99,
        settlementDays: 0,
        availability: "Instantâneo",
      },
      boleto: {
        baseRate: 0,
        fixedFee: 3.49,
        settlementDays: 2,
        defaultDueDays: 3,
        customDueDateAllowed: true,
      },
      chargeback: {
        feePerChargeback: 20.00,
        hasGuarantee: true,
        guaranteeConditions: "Proteção contra chargeback disponível mediante contratação",
      },
      settlement: {
        creditCardDefault: 14,
        creditCardParcelledDefault: 14,
        debitCardDefault: 1,
        pixDefault: 0,
        boletoDefault: 2,
      },
      platformSplit: {
        model: "Percentual sobre MDR",
      },
      integration: {
        types: ["API REST", "SDK"],
        checkoutTypes: ["Checkout Transparente", "Checkout Redirect"],
        hasFraudPrevention: true,
        hasRiskScore: true,
        has3DS: true,
        hasTokenization: true,
        isPCICompliant: true,
        hasWebhooks: true,
      },
      status10: "Ativo",
      metadata: { createdAt: now, updatedAt: now },
    },

    // 4. PAGBANK
    {
      id: crypto.randomUUID(),
      company: {
        tradeName: "PagBank",
        legalName: "PagSeguro Internet Ltda.",
        website: "https://pagseguro.uol.com.br",
        solutionType: "PSP (Payment Service Provider)",
      },
      status: "Ativo",
      startDate: new Date("2023-07-01"),
      
      partnershipConditions: {
        isExclusive: false,
        specialNotes: "Taxas diferenciadas para clientes com volume alto",
      },
      
      creditCard: {
        feesByRevenue: [
          { id: "1", condition: "Padrão", baseRate: 4.99, settlementDays: 30 },
          { id: "2", condition: "Negociada (Alto Volume)", baseRate: 3.79, settlementDays: 14 },
        ],
        maxInstallments: 12,
        interestBearer: "Lojista",
        installmentTable: [
          { installments: 2, additionalRate: 2.99, accumulatedRate: 7.98 },
          { installments: 3, additionalRate: 3.49, accumulatedRate: 8.48 },
          { installments: 6, additionalRate: 5.49, accumulatedRate: 10.48 },
          { installments: 12, additionalRate: 8.99, accumulatedRate: 13.98 },
        ],
        acceptedBrands: ["Visa", "Mastercard", "Elo", "Hipercard", "Amex"],
      },
      debitCard: {
        baseRate: 2.99,
        settlementDays: 1,
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      pix: {
        baseRate: 0.99,
        settlementDays: 0,
        availability: "Instantâneo",
      },
      boleto: {
        baseRate: 0,
        fixedFee: 3.99,
        settlementDays: 2,
        defaultDueDays: 3,
        customDueDateAllowed: true,
      },
      chargeback: {
        feePerChargeback: 20.00,
        hasGuarantee: false,
      },
      settlement: {
        creditCardDefault: 30,
        creditCardAdvanced: 14,
        creditCardParcelledDefault: 30,
        debitCardDefault: 1,
        pixDefault: 0,
        boletoDefault: 2,
      },
      platformSplit: {
        model: "Percentual sobre MDR",
      },
      integration: {
        types: ["API REST", "SDK"],
        checkoutTypes: ["Checkout Transparente", "Checkout Redirect", "Link de Pagamento"],
        hasFraudPrevention: true,
        hasRiskScore: true,
        has3DS: true,
        hasTokenization: true,
        isPCICompliant: true,
        hasWebhooks: true,
      },
      status10: "Ativo",
      metadata: { createdAt: now, updatedAt: now },
    },

    // 5. PAGHIPER
    {
      id: crypto.randomUUID(),
      company: {
        tradeName: "PagHiper",
        legalName: "PagHiper Intermediação de Negócios Ltda.",
        website: "https://www.paghiper.com",
        solutionType: "Facilitador",
      },
      status: "Ativo",
      startDate: new Date("2023-09-01"),
      
      observations: {
        competitiveDifferentials: [
          "Especialista em boleto bancário",
          "Taxas escalonadas por volume",
          "Foco em e-commerce B2B",
        ],
      },
      
      creditCard: {
        feesByRevenue: [
          { id: "1", condition: "Até R$ 50k/mês", baseRate: 4.99, settlementDays: 30 },
          { id: "2", condition: "R$ 50k - R$ 200k/mês", baseRate: 4.49, settlementDays: 30 },
          { id: "3", condition: "Acima de R$ 200k/mês", baseRate: 3.99, settlementDays: 30 },
        ],
        maxInstallments: 12,
        interestBearer: "Lojista",
        installmentTable: [],
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      debitCard: {
        baseRate: 2.99,
        settlementDays: 1,
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      pix: {
        baseRate: 0.99,
        settlementDays: 0,
        availability: "Instantâneo",
      },
      boleto: {
        baseRate: 0,
        fixedFee: 2.49,
        settlementDays: 1,
        defaultDueDays: 3,
        customDueDateAllowed: true,
      },
      chargeback: {
        feePerChargeback: 0,
        hasGuarantee: false,
      },
      settlement: {
        creditCardDefault: 30,
        creditCardParcelledDefault: 30,
        debitCardDefault: 1,
        pixDefault: 0,
        boletoDefault: 1,
        notes: "Liquidação D+1 para boleto (diferencial competitivo)",
      },
      platformSplit: {
        model: "Percentual sobre MDR",
      },
      integration: {
        types: ["API REST"],
        checkoutTypes: ["Checkout Transparente", "Link de Pagamento"],
        hasFraudPrevention: false,
        hasRiskScore: false,
        has3DS: false,
        hasTokenization: false,
        isPCICompliant: true,
        hasWebhooks: true,
      },
      status10: "Ativo",
      metadata: { createdAt: now, updatedAt: now },
    },

    // 6. PAYPAL
    {
      id: crypto.randomUUID(),
      company: {
        tradeName: "PayPal",
        legalName: "PayPal do Brasil Serviços de Pagamentos Ltda.",
        website: "https://www.paypal.com/br",
        solutionType: "Gateway de Pagamento",
      },
      status: "Ativo",
      startDate: new Date("2023-04-01"),
      
      observations: {
        competitiveDifferentials: [
          "Líder global em pagamentos online",
          "Forte proteção para vendedor e comprador",
          "Suporte a transações internacionais",
        ],
      },
      
      creditCard: {
        feesByRevenue: [
          { id: "1", condition: "Padrão (Nacional)", baseRate: 4.99, fixedFee: 0.60, settlementDays: 1 },
          { id: "2", condition: "Internacional", baseRate: 6.40, fixedFee: 0.60, settlementDays: 1 },
        ],
        maxInstallments: 12,
        interestBearer: "Comprador",
        installmentTable: [
          { installments: 2, additionalRate: 0, accumulatedRate: 4.99 },
          { installments: 3, additionalRate: 0, accumulatedRate: 4.99 },
          { installments: 6, additionalRate: 0, accumulatedRate: 4.99 },
          { installments: 12, additionalRate: 0, accumulatedRate: 4.99 },
        ],
        acceptedBrands: ["Visa", "Mastercard", "Elo", "Hipercard", "Amex"],
      },
      debitCard: {
        baseRate: 4.99,
        fixedFee: 0.60,
        settlementDays: 1,
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      pix: {
        baseRate: 0.99,
        settlementDays: 0,
        availability: "Instantâneo",
      },
      boleto: {
        baseRate: 4.99,
        fixedFee: 0.60,
        settlementDays: 2,
        defaultDueDays: 3,
        customDueDateAllowed: true,
      },
      digitalAccount: {
        monthlyFee: 0,
        nationalPaymentsFee: 4.99,
        internationalPaymentsFee: 6.40,
        iofPercentage: 6.38,
        hasCheckingAccount: true,
        hasCreditLine: false,
        notes: "Conta gratuita com saldo em dólar disponível",
      },
      atmWithdrawal: {
        debitCardNational: 4.99,
        iofPercentage: 0,
        notes: "Saque com taxa fixa",
      },
      chargeback: {
        feePerChargeback: 60.00,
        hasGuarantee: true,
        guaranteeConditions: "Proteção de Vendedor disponível para transações elegíveis",
      },
      settlement: {
        creditCardDefault: 1,
        creditCardParcelledDefault: 1,
        debitCardDefault: 1,
        pixDefault: 0,
        boletoDefault: 2,
      },
      platformSplit: {
        model: "Percentual sobre MDR",
      },
      integration: {
        types: ["API REST", "SDK"],
        checkoutTypes: ["Checkout Redirect", "Checkout Lightbox"],
        hasFraudPrevention: true,
        hasRiskScore: true,
        has3DS: true,
        hasTokenization: true,
        isPCICompliant: true,
        hasWebhooks: true,
      },
      status10: "Ativo",
      metadata: { createdAt: now, updatedAt: now },
    },
  ];
}
