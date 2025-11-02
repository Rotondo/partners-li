-- Adicionar campos estratégicos aos parceiros
ALTER TABLE partners ADD COLUMN IF NOT EXISTS rebate_config JSONB DEFAULT '{}'::jsonb;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS fit_by_tier JSONB DEFAULT '{}'::jsonb;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS strategic_priority TEXT;

-- Criar tabela de métricas de loja x parceiro
CREATE TABLE IF NOT EXISTS store_partner_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  store_tier TEXT NOT NULL,
  monthly_gmv DECIMAL(15,2) DEFAULT 0,
  partner_revenue DECIMAL(15,2) DEFAULT 0,
  rebate_generated DECIMAL(15,2) DEFAULT 0,
  rebate_percentage DECIMAL(5,2) DEFAULT 0,
  fit_score INTEGER DEFAULT 50,
  roi DECIMAL(5,2) DEFAULT 0,
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(store_id, partner_id, period_start)
);

-- RLS para store_partner_metrics
ALTER TABLE store_partner_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own store metrics"
  ON store_partner_metrics FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own store metrics"
  ON store_partner_metrics FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own store metrics"
  ON store_partner_metrics FOR UPDATE
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own store metrics"
  ON store_partner_metrics FOR DELETE
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_store_partner_metrics_store ON store_partner_metrics(store_id);
CREATE INDEX IF NOT EXISTS idx_store_partner_metrics_partner ON store_partner_metrics(partner_id);
CREATE INDEX IF NOT EXISTS idx_store_partner_metrics_period ON store_partner_metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_store_partner_metrics_user ON store_partner_metrics(user_id);

-- Trigger para updated_at
CREATE TRIGGER update_store_partner_metrics_updated_at
  BEFORE UPDATE ON store_partner_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();