-- Create user_calendar_sync table with OAuth support
CREATE TABLE IF NOT EXISTS public.user_calendar_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calendar_url TEXT,
  enabled BOOLEAN DEFAULT true,
  sync_interval_minutes INTEGER DEFAULT 15,
  last_sync_at TIMESTAMPTZ,
  google_access_token TEXT,
  google_refresh_token TEXT,
  google_token_expires_at TIMESTAMPTZ,
  google_calendar_id TEXT DEFAULT 'primary',
  connected_via_oauth BOOLEAN DEFAULT false,
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

-- Comments
COMMENT ON TABLE public.user_calendar_sync IS 'Armazena configurações de sincronização de calendário via OAuth ou feed iCal';
COMMENT ON COLUMN public.user_calendar_sync.calendar_url IS 'URL do feed iCal público (opcional, usado apenas como fallback)';
COMMENT ON COLUMN public.user_calendar_sync.google_access_token IS 'Token de acesso OAuth do Google Calendar API';
COMMENT ON COLUMN public.user_calendar_sync.google_refresh_token IS 'Token de refresh OAuth para renovar access_token';
COMMENT ON COLUMN public.user_calendar_sync.google_token_expires_at IS 'Data/hora de expiração do access_token';
COMMENT ON COLUMN public.user_calendar_sync.google_calendar_id IS 'ID do calendário Google (primary por padrão)';
COMMENT ON COLUMN public.user_calendar_sync.connected_via_oauth IS 'Se true, usa OAuth. Se false, usa iCal feed';