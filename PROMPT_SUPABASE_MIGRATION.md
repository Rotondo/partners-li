# Prompt para Cadastro de Tabelas no Supabase (Lovable)

Copie e cole o seguinte prompt no Lovable para criar as tabelas e campos necessários:

---

## PROMPT COMPLETO PARA LOVABLE:

Preciso criar duas migrations SQL no Supabase para adicionar funcionalidades de priorização de parceiros e métricas mensais completas. Execute as seguintes migrations SQL na ordem:

### MIGRATION 1: Priorização e Métricas Base

```sql
-- Migration: Add partner priority and monthly metrics support
-- Purpose: Enable tracking of partner importance (1st, 2nd, 3rd place) and monthly GMV/rebate metrics
-- Applied to: payment and logistic partners

-- 1. Add priority fields to partners table
ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS is_important BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS priority_rank INTEGER CHECK (priority_rank IS NULL OR priority_rank > 0),
ADD COLUMN IF NOT EXISTS pareto_focus TEXT CHECK (pareto_focus IS NULL OR pareto_focus IN ('gmv', 'rebate'));

-- 2. Create table for monthly metrics
CREATE TABLE IF NOT EXISTS public.partner_monthly_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  gmv_share DECIMAL(5,2) DEFAULT 0 CHECK (gmv_share >= 0 AND gmv_share <= 100), -- % share
  rebate_share DECIMAL(5,2) DEFAULT 0 CHECK (rebate_share >= 0 AND rebate_share <= 100), -- % share
  gmv_amount DECIMAL(15,2) DEFAULT 0 CHECK (gmv_amount >= 0), -- Valor absoluto em R$
  rebate_amount DECIMAL(15,2) DEFAULT 0 CHECK (rebate_amount >= 0), -- Valor absoluto em R$
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(partner_id, user_id, year, month)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_partner_metrics_partner_id ON public.partner_monthly_metrics(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_metrics_user_id ON public.partner_monthly_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_metrics_year_month ON public.partner_monthly_metrics(year, month);
CREATE INDEX IF NOT EXISTS idx_partners_important ON public.partners(is_important) WHERE is_important = true;
CREATE INDEX IF NOT EXISTS idx_partners_priority ON public.partners(priority_rank) WHERE priority_rank IS NOT NULL;

-- Enable RLS
ALTER TABLE public.partner_monthly_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_monthly_metrics
CREATE POLICY "Users can view their own partner metrics"
  ON public.partner_monthly_metrics FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own partner metrics"
  ON public.partner_monthly_metrics FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own partner metrics"
  ON public.partner_monthly_metrics FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own partner metrics"
  ON public.partner_monthly_metrics FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_partner_monthly_metrics_updated_at
  BEFORE UPDATE ON public.partner_monthly_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comments for documentation
COMMENT ON COLUMN public.partners.is_important IS 'Indica se o parceiro é considerado importante para o negócio';
COMMENT ON COLUMN public.partners.priority_rank IS 'Ranking de prioridade (1 = 1º lugar, 2 = 2º lugar, etc). Não limitado a top 3.';
COMMENT ON COLUMN public.partners.pareto_focus IS 'Métrica usada para análise de Pareto (80/20): gmv ou rebate';
COMMENT ON TABLE public.partner_monthly_metrics IS 'Armazena métricas mensais de GMV e rebate por parceiro. Permite análise histórica e identificação de padrões.';
COMMENT ON COLUMN public.partner_monthly_metrics.gmv_share IS 'Percentual de participação no GMV total do mês';
COMMENT ON COLUMN public.partner_monthly_metrics.rebate_share IS 'Percentual de participação no rebate total do mês';
COMMENT ON COLUMN public.partner_monthly_metrics.gmv_amount IS 'Valor absoluto de GMV transacionado no mês (R$)';
COMMENT ON COLUMN public.partner_monthly_metrics.rebate_amount IS 'Valor absoluto de rebate gerado no mês (R$)';
```

### MIGRATION 2: Campos Adicionais de Métricas

```sql
-- Migration: Add additional monthly metrics fields
-- Purpose: Add numberOfStores, approvalRate, and numberOfOrders to partner_monthly_metrics
-- Date: 2025-11-02

-- Add new columns to partner_monthly_metrics table
ALTER TABLE public.partner_monthly_metrics
ADD COLUMN IF NOT EXISTS number_of_stores INTEGER DEFAULT 0 CHECK (number_of_stores >= 0),
ADD COLUMN IF NOT EXISTS approval_rate DECIMAL(5,2) DEFAULT 0 CHECK (approval_rate >= 0 AND approval_rate <= 100),
ADD COLUMN IF NOT EXISTS number_of_orders INTEGER DEFAULT 0 CHECK (number_of_orders >= 0);

-- Add comments for documentation
COMMENT ON COLUMN public.partner_monthly_metrics.number_of_stores IS 'Número de lojas ativas usando este parceiro no mês';
COMMENT ON COLUMN public.partner_monthly_metrics.approval_rate IS 'Taxa de aprovação de transações no mês (%)';
COMMENT ON COLUMN public.partner_monthly_metrics.number_of_orders IS 'Número total de pedidos/transações processados no mês';
```

---

## Resumo do que as migrations fazem:

### Migration 1 - Priorização e Métricas Base:
1. **Adiciona 3 campos na tabela `partners`:**
   - `is_important` (BOOLEAN) - marca parceiros importantes
   - `priority_rank` (INTEGER) - ranking de prioridade (1, 2, 3, etc - não limitado a top 3)
   - `pareto_focus` (TEXT) - métrica de foco para análise Pareto: 'gmv' ou 'rebate'

2. **Cria nova tabela `partner_monthly_metrics`:**
   - Armazena métricas mensais de GMV e rebate por parceiro
   - Campos principais: `gmv_share`, `rebate_share`, `gmv_amount`, `rebate_amount`
   - Unique constraint garante uma métrica por parceiro/mês/ano
   - RLS Policies para segurança
   - Indexes para performance

### Migration 2 - Campos Adicionais:
3. **Adiciona 3 novos campos na tabela `partner_monthly_metrics`:**
   - `number_of_stores` (INTEGER) - Número de lojas ativas no mês
   - `approval_rate` (DECIMAL) - Taxa de aprovação de transações (%)
   - `number_of_orders` (INTEGER) - Número total de pedidos/transações

### Funcionalidades Completas:
- ✅ Tracking mensal completo de métricas por parceiro
- ✅ Priorização automática baseada em Pareto (80/20)
- ✅ Campos para número de lojas, taxa de aprovação e número de pedidos
- ✅ Suporte para análise histórica e identificação de padrões
- ✅ Aplicável a parceiros de pagamento e logística

**IMPORTANTE:** 
- Execute as migrations na ordem (primeiro Migration 1, depois Migration 2)
- Ambas as migrations são seguras e usam `IF NOT EXISTS` para não causar erros se executadas múltiplas vezes
- Aplique no Supabase através do SQL Editor ou via migrations no Lovable

### MIGRATION 3: Google Calendar Sync (iCal Feed)

```sql
-- Migration: Add Google Calendar sync via iCal feed
-- Purpose: Allow users to sync their Google Calendar events by providing a public iCal link
-- Date: 2025-11-02

CREATE TABLE IF NOT EXISTS public.user_calendar_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calendar_url TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  sync_interval_minutes INTEGER DEFAULT 15,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_calendar_sync_user_id ON public.user_calendar_sync(user_id);
CREATE INDEX IF NOT EXISTS idx_user_calendar_sync_enabled ON public.user_calendar_sync(enabled) WHERE enabled = true;

-- Enable RLS
ALTER TABLE public.user_calendar_sync ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own calendar sync config"
  ON public.user_calendar_sync FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own calendar sync config"
  ON public.user_calendar_sync FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own calendar sync config"
  ON public.user_calendar_sync FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own calendar sync config"
  ON public.user_calendar_sync FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_user_calendar_sync_updated_at
  BEFORE UPDATE ON public.user_calendar_sync
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add google_event_id to partner_activities for tracking
ALTER TABLE public.partner_activities
ADD COLUMN IF NOT EXISTS google_event_id TEXT,
ADD COLUMN IF NOT EXISTS google_calendar_synced BOOLEAN DEFAULT false;

-- Add index for google_event_id lookups
CREATE INDEX IF NOT EXISTS idx_partner_activities_google_event_id 
ON public.partner_activities(google_event_id) 
WHERE google_event_id IS NOT NULL;

-- Comments
COMMENT ON TABLE public.user_calendar_sync IS 'Armazena configurações de sincronização de calendário via feed iCal público';
COMMENT ON COLUMN public.user_calendar_sync.calendar_url IS 'URL do feed iCal público do Google Calendar';
COMMENT ON COLUMN public.user_calendar_sync.enabled IS 'Se a sincronização automática está ativa';
COMMENT ON COLUMN public.user_calendar_sync.sync_interval_minutes IS 'Intervalo em minutos entre sincronizações automáticas';
COMMENT ON COLUMN public.partner_activities.google_event_id IS 'ID do evento no Google Calendar (para evitar duplicatas)';
```

---

## Checklist de Verificação:

Após executar as migrations, verifique se foram criadas:

- [ ] Colunas `is_important`, `priority_rank`, `pareto_focus` na tabela `partners`
- [ ] Tabela `partner_monthly_metrics` criada
- [ ] Colunas `number_of_stores`, `approval_rate`, `number_of_orders` na tabela `partner_monthly_metrics`
- [ ] RLS Policies criadas e ativas
- [ ] Indexes criados
- [ ] Trigger `update_partner_monthly_metrics_updated_at` criado
- [ ] Tabela `user_calendar_sync` criada
- [ ] Colunas `google_event_id` e `google_calendar_synced` adicionadas em `partner_activities`
- [ ] RLS Policies criadas para `user_calendar_sync`
- [ ] Trigger `update_user_calendar_sync_updated_at` criado

---
