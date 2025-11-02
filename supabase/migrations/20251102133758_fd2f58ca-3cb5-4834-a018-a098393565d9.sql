-- Add data_extended column for granular payment method data
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS data_extended JSONB DEFAULT '{}'::jsonb;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_solution_type 
ON payment_methods USING GIN ((data->'company'));

CREATE INDEX IF NOT EXISTS idx_payment_methods_status 
ON payment_methods ((data->>'status'));

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_status 
ON payment_methods (user_id, (data->>'status'));