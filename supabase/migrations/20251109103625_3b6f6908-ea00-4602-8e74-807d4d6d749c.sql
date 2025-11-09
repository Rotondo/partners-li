-- Create expectation_milestones table
CREATE TABLE IF NOT EXISTS public.expectation_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('general', 'marketplace', 'logistic', 'payment')),
  deadline_days INTEGER NOT NULL,
  title TEXT NOT NULL,
  opportunities_risks TEXT,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'blocked', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create milestone_updates table
CREATE TABLE IF NOT EXISTS public.milestone_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES public.expectation_milestones(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  update_type TEXT NOT NULL CHECK (update_type IN ('progress', 'data', 'conclusion', 'next_steps', 'blocker')),
  content TEXT NOT NULL,
  data_points JSONB,
  attachments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create milestone_checkboxes table
CREATE TABLE IF NOT EXISTS public.milestone_checkboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES public.expectation_milestones(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  is_checked BOOLEAN DEFAULT FALSE,
  checked_at TIMESTAMPTZ,
  checked_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_expectation_milestones_user_id ON public.expectation_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_expectation_milestones_category ON public.expectation_milestones(category);
CREATE INDEX IF NOT EXISTS idx_expectation_milestones_status ON public.expectation_milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestone_updates_milestone_id ON public.milestone_updates(milestone_id);
CREATE INDEX IF NOT EXISTS idx_milestone_checkboxes_milestone_id ON public.milestone_checkboxes(milestone_id);

-- Enable RLS
ALTER TABLE public.expectation_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone_checkboxes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for expectation_milestones
CREATE POLICY "Users can view their own milestones"
  ON public.expectation_milestones FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own milestones"
  ON public.expectation_milestones FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own milestones"
  ON public.expectation_milestones FOR UPDATE
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own milestones"
  ON public.expectation_milestones FOR DELETE
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for milestone_updates
CREATE POLICY "Users can view updates for their milestones"
  ON public.milestone_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.expectation_milestones 
      WHERE id = milestone_updates.milestone_id 
      AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    )
  );

CREATE POLICY "Users can create updates for their milestones"
  ON public.milestone_updates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.expectation_milestones 
      WHERE id = milestone_updates.milestone_id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for milestone_checkboxes
CREATE POLICY "Users can view checkboxes for their milestones"
  ON public.milestone_checkboxes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.expectation_milestones 
      WHERE id = milestone_checkboxes.milestone_id 
      AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    )
  );

CREATE POLICY "Users can create checkboxes for their milestones"
  ON public.milestone_checkboxes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.expectation_milestones 
      WHERE id = milestone_checkboxes.milestone_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update checkboxes for their milestones"
  ON public.milestone_checkboxes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.expectation_milestones 
      WHERE id = milestone_checkboxes.milestone_id 
      AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    )
  );

CREATE POLICY "Users can delete checkboxes for their milestones"
  ON public.milestone_checkboxes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.expectation_milestones 
      WHERE id = milestone_checkboxes.milestone_id 
      AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    )
  );

-- Create trigger for expectation_milestones updated_at
CREATE TRIGGER update_expectation_milestones_updated_at
  BEFORE UPDATE ON public.expectation_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for milestone_checkboxes updated_at
CREATE TRIGGER update_milestone_checkboxes_updated_at
  BEFORE UPDATE ON public.milestone_checkboxes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();