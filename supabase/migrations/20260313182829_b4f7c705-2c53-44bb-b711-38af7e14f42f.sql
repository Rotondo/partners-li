
-- Enable RLS on all new tables with permissive policies (no auth for now)
ALTER TABLE public.maturity_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecosystem_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_stage_maturity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_contracts ENABLE ROW LEVEL SECURITY;

-- Permissive policies for all operations (will restrict with auth later)
CREATE POLICY "Allow all on maturity_levels" ON public.maturity_levels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ecosystem_stages" ON public.ecosystem_stages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on partner_stage_maturity" ON public.partner_stage_maturity FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on partner_contacts" ON public.partner_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on partner_pipeline" ON public.partner_pipeline FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on partner_meetings" ON public.partner_meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on partner_contracts" ON public.partner_contracts FOR ALL USING (true) WITH CHECK (true);
