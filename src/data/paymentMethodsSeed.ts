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
      },
      documentation: {
        apiDocsUrl: "https://www.mercadopago.com.br/developers/pt/docs",
      },
      status: "Ativo",
      startDate: new Date("2023-06-01"),
      
      // E-commerce (checkout transparente e redirect)
      creditCard: {
        feesByRevenue: [
          { id: "1", condition: "D+0 (na hora)", baseRate: 4.99, settlementDays: 0 },
          { id: "2", condition: "D+14", baseRate: 4.49, settlementDays: 14 },
          { id: "3", condition: "D+30", baseRate: 3.99, settlementDays: 30 },
        ],
        maxInstallments: 12,
        interestBearer: "Lojista",
        installmentTable: [],
        acceptedBrands: ["Visa", "Mastercard", "Elo", "Hipercard", "Amex"],
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
        settlementDays: 3,
        defaultDueDays: 3,
        customDueDateAllowed: true,
      },
      
      // Maquininha Point
      posFees: {
        creditVista: 4.98,
        creditInstallments: 5.31,
        debit: 1.99,
        pix: 0.00,
        installmentTable: [
          { installments: 2, additionalRate: 4.59, accumulatedRate: 9.90 },
          { installments: 3, additionalRate: 5.97, accumulatedRate: 11.28 },
          { installments: 4, additionalRate: 7.33, accumulatedRate: 12.64 },
          { installments: 5, additionalRate: 8.66, accumulatedRate: 13.97 },
          { installments: 6, additionalRate: 9.96, accumulatedRate: 15.27 },
          { installments: 7, additionalRate: 11.24, accumulatedRate: 16.55 },
          { installments: 8, additionalRate: 12.50, accumulatedRate: 17.81 },
          { installments: 9, additionalRate: 13.73, accumulatedRate: 19.04 },
          { installments: 10, additionalRate: 14.93, accumulatedRate: 20.24 },
          { installments: 11, additionalRate: 16.12, accumulatedRate: 21.43 },
          { installments: 12, additionalRate: 17.28, accumulatedRate: 22.59 },
        ],
        notes: "Point Mini - Taxas somadas ao processamento de 5,31%",
      },
      
      // Checkout Mercado Pago - Outros meios
      checkoutMethods: {
        mercadoPagoBalance: 4.99,
        creditLine: 4.99,
        openFinance: 0.00,
        prepaidCard: 4.99,
        notes: "Checkout: Crédito 4,98% (2-12x), Pix 0,99%, Boleto R$3,49",
      },
      
      // Conta Digital
      digitalAccount: {
        monthlyFee: 0,
        cardReissueFee: 0,
        invoiceIssuanceFee: 0,
        nationalPaymentsFee: 0,
        internationalPaymentsFee: 0,
        iofPercentage: 3.5,
        hasCheckingAccount: true,
        hasCreditLine: true,
        notes: "Cartão gratuito. IOF 3,5% em compras internacionais",
      },
      
      // Saques
      atmWithdrawal: {
        banco24HorasQR: 5.90,
        debitCardNational: 5.90,
        debitCardInternational: 9.90,
        creditCardNational: 9.90,
        creditCardInternational: 9.90,
        iofPercentage: 3.5,
        notes: "Crédito: +14% juros. Internacional: +3,5% IOF",
      },
      
      // Depósitos
      deposits: {
        pix: 0,
        ted: 0,
        boleto: 0,
        boletoFreeLimit: 10,
        lottery: 0,
        lotteryFreeLimit: 10,
        virtualDebitCard: 1.99,
        notes: "10 depósitos gratuitos/mês (boleto e lotérica). Acima: R$3,49",
      },
      
      // Criptomoedas
      crypto: {
        buyRate: 1.5,
        sellRate: 1.5,
        minimumBuy: 1.00,
        minimumSell: 0.25,
        monthlyLimit: 100000,
        supportedCoins: ["BTC", "ETH", "USDC"],
        notes: "Taxa 1,5% compra/venda. Limite mensal R$100.000",
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
        boletoDefault: 3,
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

    // 2. APP MAX
    {
      id: crypto.randomUUID(),
      company: {
        tradeName: "APP MAX",
        legalName: "APP MAX Instituição de Pagamento S.A.",
        website: "https://appmax.com.br",
        solutionType: "Subadquirente",
      },
      documentation: {
        publicFeesUrl: "https://appmax.com.br/taxas",
      },
      status: "Ativo",
      startDate: new Date("2023-08-01"),
      
      creditCard: {
        feesByRevenue: [
          { id: "1", condition: "Abaixo R$100k/mês", baseRate: 4.99, settlementDays: 30 },
          { id: "2", condition: "Acima R$100k/mês", baseRate: 3.49, settlementDays: 30 },
          { id: "3", condition: "Dropshipping", baseRate: 4.99, settlementDays: 30 },
        ],
        additionalRatePerInstallment: 2.49,
        maxInstallments: 12,
        interestBearer: "Lojista",
        installmentTable: [],
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      debitCard: {
        baseRate: 9.90,
        fixedFee: 0.50,
        settlementDays: 30,
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      pix: {
        baseRate: 1.00,
        settlementDays: 30,
        availability: "D+X",
        availabilityDays: 30,
      },
      boleto: {
        baseRate: 0,
        fixedFee: 3.49,
        settlementDays: 30,
        defaultDueDays: 3,
        customDueDateAllowed: true,
      },
      minimumCharges: {
        pix: 1.00,
        creditCard: 3.00,
        boleto: 3.49,
      },
      receivablesAdvance: {
        available: true,
        advanceRate: 1.49,
        defaultDays: 30,
        advancedDays: 1,
        type: "Sob Demanda",
      },
      withdrawal: {
        feePerWithdrawal: 3.67,
        additionalFeePerTransaction: 0.99,
        freeWithdrawalFrom: 10000,
        notes: "Saque gratuito acima de R$10.000",
      },
      chargeback: {
        feePerChargeback: 25.00,
        hasGuarantee: false,
      },
      settlement: {
        creditCardDefault: 30,
        creditCardAdvanced: 1,
        creditCardParcelledDefault: 30,
        debitCardDefault: 30,
        pixDefault: 30,
        boletoDefault: 30,
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
        website: "https://www.pagar.me",
        solutionType: "Gateway de Pagamento",
      },
      documentation: {
        publicFeesUrl: "https://www.pagar.me/ofertas",
      },
      status: "Ativo",
      startDate: new Date("2023-05-01"),
      
      partnershipConditions: {
        isExclusive: true,
        partnerName: "Loja Integrada",
        specialNotes: "Condições exclusivas para clientes Loja Integrada",
      },
      
      creditCard: {
        feesByRevenue: [
          { id: "1", condition: "Loja Integrada", baseRate: 3.29, fixedFee: 0.99, settlementDays: 30 },
        ],
        maxInstallments: 12,
        interestBearer: "Lojista",
        installmentTable: [],
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
        fixedFee: 2.99,
        settlementDays: 2,
        defaultDueDays: 3,
        customDueDateAllowed: true,
      },
      chargeback: {
        feePerChargeback: 20.00,
        hasGuarantee: true,
        guaranteeConditions: "Garantia de chargeback negociada separadamente",
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
      },
      integration: {
        types: ["API REST", "SDK"],
        checkoutTypes: ["Checkout Transparente"],
        hasFraudPrevention: true,
        hasRiskScore: true,
        has3DS: true,
        hasTokenization: true,
        isPCICompliant: true,
        hasWebhooks: true,
      },
      observations: {
        competitiveDifferentials: [
          "Antifraude próprio",
          "Garantia de chargeback disponível",
          "Checkout transparente",
        ],
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
        isExclusive: true,
        partnerName: "Loja Integrada",
        publicRatesUrl: "https://pagseguro.uol.com.br/taxas",
        specialNotes: "Taxas diferenciadas disponíveis no painel da Loja Integrada",
      },
      
      creditCard: {
        feesByRevenue: [
          { id: "1", condition: "Loja Integrada D+14", baseRate: 3.99, fixedFee: 0.20, settlementDays: 14 },
          { id: "2", condition: "Loja Integrada D+30", baseRate: 3.39, fixedFee: 0.20, settlementDays: 30 },
          { id: "3", condition: "Público D+14", baseRate: 4.99, fixedFee: 0.40, settlementDays: 14 },
          { id: "4", condition: "Público D+30", baseRate: 3.99, fixedFee: 0.40, settlementDays: 30 },
        ],
        maxInstallments: 12,
        interestBearer: "Lojista",
        installmentTable: [],
        acceptedBrands: ["Visa", "Mastercard", "Elo", "Hipercard", "Amex"],
      },
      debitCard: {
        baseRate: 2.39,
        settlementDays: 1,
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      pix: {
        baseRate: 1.89,
        settlementDays: 0,
        availability: "Instantâneo",
      },
      boleto: {
        baseRate: 0,
        fixedFee: 2.99,
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
      observations: {
        knownLimitations: [
          "Configurar parcelamento no menu Vendas > Criar promoção para sincronizar com Loja Integrada",
        ],
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
      
      partnershipConditions: {
        isExclusive: true,
        partnerName: "Loja Integrada",
        specialNotes: "Especialista em boleto - parceiro exclusivo Loja Integrada",
      },
      
      observations: {
        competitiveDifferentials: [
          "Especialista em boleto bancário",
          "Taxas escalonadas por volume",
          "Liquidação em 2 dias",
        ],
      },
      
      creditCard: {
        feesByRevenue: [],
        maxInstallments: 1,
        interestBearer: "Lojista",
        installmentTable: [],
        acceptedBrands: [],
      },
      debitCard: {
        baseRate: 0,
        settlementDays: 0,
        acceptedBrands: [],
      },
      pix: {
        baseRate: 0,
        settlementDays: 0,
        availability: "D+0",
      },
      boleto: {
        baseRate: 0,
        fixedFee: 2.39,
        settlementDays: 2,
        defaultDueDays: 3,
        customDueDateAllowed: true,
      },
      otherFees: [
        { id: "1", type: "0-500 tx ou até R$75k", amount: 2.49, periodicity: "Por boleto pago" },
        { id: "2", type: "501-1000 tx ou até R$150k", amount: 2.39, periodicity: "Por boleto pago" },
        { id: "3", type: "1001-2000 tx ou até R$300k", amount: 2.29, periodicity: "Por boleto pago" },
        { id: "4", type: "2001-4000 tx ou até R$600k", amount: 2.19, periodicity: "Por boleto pago" },
        { id: "5", type: "4001-6000 tx ou até R$900k", amount: 2.09, periodicity: "Por boleto pago" },
        { id: "6", type: "6001-8000 tx ou até R$1,2M", amount: 1.99, periodicity: "Por boleto pago" },
      ],
      chargeback: {
        feePerChargeback: 0,
        hasGuarantee: false,
      },
      settlement: {
        creditCardDefault: 0,
        creditCardParcelledDefault: 0,
        debitCardDefault: 0,
        pixDefault: 0,
        boletoDefault: 2,
        notes: "Especializado em boleto - D+2",
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
      
      partnershipConditions: {
        isExclusive: true,
        partnerName: "Loja Integrada",
        specialNotes: "Condições exclusivas para Loja Integrada",
      },
      
      observations: {
        competitiveDifferentials: [
          "Líder global em pagamentos online",
          "Proteção para vendedor e comprador",
          "Suporte a transações internacionais",
        ],
      },
      
      creditCard: {
        feesByRevenue: [
          { id: "1", condition: "Loja Integrada D+0", baseRate: 4.79, fixedFee: 0.60, settlementDays: 0 },
          { id: "2", condition: "Loja Integrada D+30", baseRate: 3.60, fixedFee: 0.60, settlementDays: 30 },
          { id: "3", condition: "Público", baseRate: 4.79, fixedFee: 0.60, settlementDays: 1 },
        ],
        additionalRatePerInstallment: 1.92,
        maxInstallments: 12,
        interestBearer: "Comprador",
        installmentTable: [
          { installments: 2, additionalRate: 1.92, accumulatedRate: 1.92 },
          { installments: 3, additionalRate: 3.84, accumulatedRate: 3.84 },
          { installments: 4, additionalRate: 5.76, accumulatedRate: 5.76 },
          { installments: 5, additionalRate: 7.68, accumulatedRate: 7.68 },
          { installments: 6, additionalRate: 9.60, accumulatedRate: 9.60 },
          { installments: 7, additionalRate: 11.52, accumulatedRate: 11.52 },
          { installments: 8, additionalRate: 13.44, accumulatedRate: 13.44 },
          { installments: 9, additionalRate: 15.36, accumulatedRate: 15.36 },
          { installments: 10, additionalRate: 17.28, accumulatedRate: 17.28 },
          { installments: 11, additionalRate: 19.20, accumulatedRate: 19.20 },
          { installments: 12, additionalRate: 21.12, accumulatedRate: 21.12 },
        ],
        acceptedBrands: ["Visa", "Mastercard", "Elo", "Hipercard"],
      },
      debitCard: {
        baseRate: 4.79,
        fixedFee: 0.60,
        settlementDays: 1,
        acceptedBrands: ["Visa", "Mastercard", "Elo"],
      },
      pix: {
        baseRate: 0.99,
        fixedFee: 0.10,
        settlementDays: 0,
        availability: "D+0",
      },
      boleto: {
        baseRate: 4.79,
        fixedFee: 0.60,
        settlementDays: 2,
        defaultDueDays: 3,
        customDueDateAllowed: true,
      },
      digitalAccount: {
        monthlyFee: 0,
        nationalPaymentsFee: 4.79,
        internationalPaymentsFee: 4.79,
        hasCheckingAccount: true,
        hasCreditLine: false,
        notes: "Conta gratuita com suporte a saldo em dólar",
      },
      chargeback: {
        feePerChargeback: 60.00,
        hasGuarantee: true,
        guaranteeConditions: "Proteção de Vendedor para transações elegíveis",
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
        checkoutTypes: ["Checkout Transparente", "Checkout Redirect", "Checkout Lightbox"],
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
