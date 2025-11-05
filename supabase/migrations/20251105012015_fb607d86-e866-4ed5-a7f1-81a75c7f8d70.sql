-- Sprint 6.1: Legal/Jurídico - Contracts Management
-- Purpose: Enable contract tracking with versions and signers

-- 1. Create enum for contract status
CREATE TYPE contract_status AS ENUM (
  'draft',
  'under_review',
  'awaiting_signature',
  'active',
  'expired',
  'cancelled'
);

-- 2. Create contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status contract_status NOT NULL DEFAULT 'draft',
  contract_value DECIMAL(15,2),
  currency TEXT DEFAULT 'BRL',
  start_date DATE,
  end_date DATE,
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create contract versions table (for document storage tracking)
CREATE TABLE IF NOT EXISTS public.contract_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contract_id, version_number)
);

-- 4. Create contract signers table
CREATE TABLE IF NOT EXISTS public.contract_signers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  signer_name TEXT NOT NULL,
  signer_email TEXT,
  role TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contracts_partner_id ON public.contracts(partner_id);
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON public.contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_end_date ON public.contracts(end_date);
CREATE INDEX IF NOT EXISTS idx_contract_versions_contract_id ON public.contract_versions(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_signers_contract_id ON public.contract_signers(contract_id);

-- 6. Enable RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_signers ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for contracts
CREATE POLICY "Users can view their own contracts"
  ON public.contracts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own contracts"
  ON public.contracts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own contracts"
  ON public.contracts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own contracts"
  ON public.contracts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- 8. RLS Policies for contract_versions
CREATE POLICY "Users can view their contract versions"
  ON public.contract_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE contracts.id = contract_versions.contract_id
      AND (contracts.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can create their contract versions"
  ON public.contract_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE contracts.id = contract_versions.contract_id
      AND contracts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their contract versions"
  ON public.contract_versions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE contracts.id = contract_versions.contract_id
      AND (contracts.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can delete their contract versions"
  ON public.contract_versions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE contracts.id = contract_versions.contract_id
      AND (contracts.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

-- 9. RLS Policies for contract_signers
CREATE POLICY "Users can view their contract signers"
  ON public.contract_signers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE contracts.id = contract_signers.contract_id
      AND (contracts.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can create their contract signers"
  ON public.contract_signers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE contracts.id = contract_signers.contract_id
      AND contracts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their contract signers"
  ON public.contract_signers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE contracts.id = contract_signers.contract_id
      AND (contracts.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can delete their contract signers"
  ON public.contract_signers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE contracts.id = contract_signers.contract_id
      AND (contracts.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

-- 10. Trigger for updated_at
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Comments for documentation
COMMENT ON TABLE public.contracts IS 'Legal contracts for partners with status tracking';
COMMENT ON TABLE public.contract_versions IS 'Version history of contract documents stored in Storage';
COMMENT ON TABLE public.contract_signers IS 'Signatories for each contract';
COMMENT ON COLUMN public.contracts.status IS 'Current status of the contract lifecycle';
COMMENT ON COLUMN public.contracts.auto_renew IS 'Whether contract auto-renews after end_date';
COMMENT ON COLUMN public.contract_versions.storage_path IS 'Path to document in Supabase Storage (partner-documents bucket)';