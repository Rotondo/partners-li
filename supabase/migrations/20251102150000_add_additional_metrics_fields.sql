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

