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
  gmv_share DECIMAL(5,2) DEFAULT 0 CHECK (gmv_share >= 0 AND gmv_share <= 100),
  rebate_share DECIMAL(5,2) DEFAULT 0 CHECK (rebate_share >= 0 AND rebate_share <= 100),
  gmv_amount DECIMAL(15,2) DEFAULT 0 CHECK (gmv_amount >= 0),
  rebate_amount DECIMAL(15,2) DEFAULT 0 CHECK (rebate_amount >= 0),
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