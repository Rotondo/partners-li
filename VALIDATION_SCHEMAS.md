# 📋 Guia de Validação de Parceiros com Zod

Este documento explica como usar os schemas de validação Zod para parceiros no sistema Partners LI.

## 📚 Schemas Disponíveis

### 1. **Schemas Base**

#### `sharedPartnerSchema`
Valida campos compartilhados por todos os tipos de parceiros:
- `name`: string (1-200 caracteres)
- `startDate`: Date (obrigatório)
- `status`: 'active' | 'inactive' | 'pending' | 'paused'
- `categories`: array de categorias (mínimo 1)
- `notes`: string opcional (máximo 5000 caracteres)

### 2. **Schemas Específicos por Tipo**

#### `logisticPartnerDataSchema`
Valida dados específicos de parceiros logísticos:
- `category`: literal 'logistic'
- `coverage`: array de estados (mínimo 1)
- `deliveryTime`: número inteiro (1-365 dias)
- `capacity`: número inteiro (> 0)
- `pricingModel`: 'fixed' | 'variable'
- `integrationType`: 'api' | 'manual'

**Exemplo:**
```typescript
import { logisticPartnerDataSchema } from '@/lib/partner-schema';

const logisticData = {
  category: 'logistic',
  coverage: ['SP', 'RJ', 'MG'],
  deliveryTime: 5,
  capacity: 1000,
  pricingModel: 'variable',
  integrationType: 'api'
};

const result = logisticPartnerDataSchema.safeParse(logisticData);
if (result.success) {
  console.log('Dados válidos!', result.data);
} else {
  console.error('Erros:', result.error.errors);
}
```

#### `paymentPartnerDataSchema`
Valida dados específicos de parceiros de pagamento:
- `category`: literal 'payment'
- `fees`: objeto com taxas (0-100%)
  - `mdrCreditVista`, `mdrDebit`, `mdrPix`, `anticipationRate`: 0-100%
  - `chargebackFee`: >= 0
- `settlement`: prazos de repasse (0-365 dias)
  - `credit`, `debit`, `pix`: número inteiro
- `takeRate`: número (0-100%)
- `performance`: objeto opcional com métricas dos últimos 3 meses

**Exemplo:**
```typescript
import { paymentPartnerDataSchema } from '@/lib/partner-schema';

const paymentData = {
  category: 'payment',
  fees: {
    mdrCreditVista: 2.5,
    mdrDebit: 1.8,
    mdrPix: 0.99,
    anticipationRate: 3.5,
    chargebackFee: 25.00
  },
  settlement: {
    credit: 30,
    debit: 1,
    pix: 0
  },
  takeRate: 15.5,
  performance: {
    month1: { approval: 85, gmv: 50000, transactions: 1200 },
    month2: { approval: 87, gmv: 55000, transactions: 1350 },
    month3: { approval: 89, gmv: 60000, transactions: 1500 }
  }
};

const result = paymentPartnerDataSchema.safeParse(paymentData);
```

#### `marketplacePartnerDataSchema`
Valida dados específicos de marketplaces:
- `category`: literal 'marketplace'
- `commission`: número (0-100%)
- `supportedCategories`: array de categorias de produtos (mínimo 1)
- `monthlyReach`: número inteiro (>= 0)
- `integrationType`: 'api' | 'manual'
- `avgConversionRate`: número opcional (0-100%)

**Exemplo:**
```typescript
import { marketplacePartnerDataSchema } from '@/lib/partner-schema';

const marketplaceData = {
  category: 'marketplace',
  commission: 12.5,
  supportedCategories: ['Eletrônicos', 'Casa e Jardim'],
  monthlyReach: 100000,
  integrationType: 'api',
  avgConversionRate: 3.5
};

const result = marketplacePartnerDataSchema.safeParse(marketplaceData);
```

### 3. **Schemas Completos**

#### `logisticPartnerSchema`
Combina `sharedPartnerSchema` + `logisticPartnerDataSchema`

#### `paymentPartnerSchema`
Combina `sharedPartnerSchema` + `paymentPartnerDataSchema`

#### `marketplacePartnerSchema`
Combina `sharedPartnerSchema` + `marketplacePartnerDataSchema`

### 4. **Schemas para Formulários**

#### `createLogisticPartnerFormSchema`
Schema "flat" para formulários de criação de parceiro logístico:

```typescript
import { createLogisticPartnerFormSchema } from '@/lib/partner-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(createLogisticPartnerFormSchema),
  defaultValues: {
    name: '',
    status: 'active',
    startDate: new Date(),
    categories: ['logistic'],
    coverage: [],
    deliveryTime: 5,
    capacity: 0,
    pricingModel: 'variable',
    integrationType: 'api',
    notes: ''
  }
});
```

#### `createPaymentPartnerFormSchema`
Schema "flat" para formulários de criação de parceiro de pagamento (mantém compatibilidade com `AddPartnerDialog` atual)

#### `createMarketplacePartnerFormSchema`
Schema "flat" para formulários de criação de marketplace

### 5. **Schema Legado**

#### `partnerSchema` + `PartnerFormData`
Mantido para compatibilidade com o componente `AddPartnerDialog.tsx` existente. Este schema ainda valida apenas parceiros de pagamento no formato antigo.

**NOTA:** Este schema será descontinuado. Use os novos schemas específicos.

## 🔧 Funções Auxiliares

### `validatePartner(partner: any)`
Valida um parceiro completo baseado em suas categorias.

```typescript
import { validatePartner } from '@/lib/partner-schema';

const partner = {
  name: 'Parceiro Multi-Categoria',
  status: 'active',
  startDate: new Date(),
  categories: ['logistic', 'payment'],
  notes: 'Observações...',
  logistic: {
    category: 'logistic',
    coverage: ['SP', 'RJ'],
    deliveryTime: 5,
    capacity: 1000,
    pricingModel: 'variable',
    integrationType: 'api'
  },
  payment: {
    category: 'payment',
    fees: { /* ... */ },
    settlement: { /* ... */ },
    takeRate: 15
  }
};

const validation = validatePartner(partner);
if (!validation.isValid) {
  console.error('Erros de validação:', validation.errors);
  // Exemplo de erro:
  // [
  //   "logistic.deliveryTime: Prazo mínimo é 1 dia",
  //   "payment.fees.mdrCreditVista: Taxa não pode ser negativa"
  // ]
}
```

### `validatePartnerData(type, data)`
Valida apenas os dados específicos de um tipo de parceiro.

```typescript
import { validatePartnerData } from '@/lib/partner-schema';

const logisticData = {
  coverage: ['SP'],
  deliveryTime: 3,
  capacity: 500,
  pricingModel: 'fixed',
  integrationType: 'manual'
};

const result = validatePartnerData('logistic', logisticData);
if (result.success) {
  console.log('Dados logísticos válidos!');
}
```

## 📝 Mensagens de Erro Personalizadas

Todos os schemas incluem mensagens de erro em português:

- ❌ "Nome é obrigatório"
- ❌ "Taxa não pode ser negativa"
- ❌ "Selecione pelo menos uma região"
- ❌ "Prazo máximo é 365 dias"
- ❌ "Capacidade deve ser maior que zero"
- ❌ "Comissão não pode exceder 100%"
- E muitas outras...

## 🔄 Migrando Código Existente

### Antes (schema antigo - apenas payment):
```typescript
import { partnerSchema } from '@/lib/partner-schema';

const form = useForm({
  resolver: zodResolver(partnerSchema),
  // ... apenas campos de payment
});
```

### Depois (novos schemas - suporta todos os tipos):

**Para Logística:**
```typescript
import { createLogisticPartnerFormSchema } from '@/lib/partner-schema';

const form = useForm({
  resolver: zodResolver(createLogisticPartnerFormSchema),
  defaultValues: {
    name: '',
    status: 'active',
    startDate: new Date(),
    categories: ['logistic'],
    coverage: [],
    deliveryTime: 5,
    capacity: 0,
    pricingModel: 'variable',
    integrationType: 'api'
  }
});
```

**Para Payment:**
```typescript
import { createPaymentPartnerFormSchema } from '@/lib/partner-schema';

const form = useForm({
  resolver: zodResolver(createPaymentPartnerFormSchema),
  // ... campos existentes
});
```

**Para Marketplace:**
```typescript
import { createMarketplacePartnerFormSchema } from '@/lib/partner-schema';

const form = useForm({
  resolver: zodResolver(createMarketplacePartnerFormSchema),
  defaultValues: {
    name: '',
    status: 'active',
    startDate: new Date(),
    categories: ['marketplace'],
    commission: 0,
    supportedCategories: [],
    monthlyReach: 0,
    integrationType: 'api'
  }
});
```

## 🚀 Exemplos de Uso em Componentes

### Validação em tempo real:
```typescript
import { validatePartner } from '@/lib/partner-schema';
import { toast } from 'sonner';

function onSubmit(data: any) {
  const validation = validatePartner(data);

  if (!validation.isValid) {
    validation.errors.forEach(error => {
      toast.error(error);
    });
    return;
  }

  // Prosseguir com salvamento
  savePartner(data);
}
```

### Validação parcial de campos:
```typescript
import { logisticPartnerDataSchema } from '@/lib/partner-schema';

function validateLogisticFields(data: any) {
  const result = logisticPartnerDataSchema.shape.coverage.safeParse(data.coverage);

  if (!result.success) {
    return { valid: false, error: result.error.errors[0].message };
  }

  return { valid: true };
}
```

## 🎯 Benefícios dos Novos Schemas

✅ **Cobertura completa**: Suporta os 3 tipos de parceiros (logistic, payment, marketplace)
✅ **Type-safe**: TypeScript infere tipos automaticamente
✅ **Validações robustas**: Limites, formatos e mensagens de erro claras
✅ **Reutilizável**: Schemas compostos a partir de schemas base
✅ **Compatível**: Mantém schema legado para código existente
✅ **Helpers úteis**: Funções auxiliares para validação flexível
✅ **Documentado**: Mensagens de erro em português

## 🔗 Arquivos Relacionados

- `/src/lib/partner-schema.ts` - Schemas Zod completos
- `/src/types/partner.ts` - Tipos TypeScript
- `/src/components/partners/AddPartnerDialog.tsx` - Formulário de criação (usar novos schemas)
- `/VALIDATION_SCHEMAS.md` - Esta documentação

## 📞 Próximos Passos

1. ✅ Schemas Zod criados para todos os tipos
2. ⏳ Atualizar formulários para usar novos schemas
3. ⏳ Adicionar validação no backend (db.ts)
4. ⏳ Criar testes unitários para schemas
5. ⏳ Documentar fluxo de dados completo
