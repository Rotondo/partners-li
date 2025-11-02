-- Migration: Add Google Calendar sync via iCal feed
-- Purpose: Allow users to sync their Google Calendar events by providing a public iCal link
-- Date: 2025-11-02

CREATE TABLE IF NOT EXISTS public.user_calendar_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calendar_url TEXT, -- Opcional, para iCal feed simples
  enabled BOOLEAN DEFAULT true,
  sync_interval_minutes INTEGER DEFAULT 15,
  last_sync_at TIMESTAMPTZ,
  -- OAuth tokens para Google Calendar API
  google_access_token TEXT,
  google_refresh_token TEXT,
  google_token_expires_at TIMESTAMPTZ,
  google_calendar_id TEXT DEFAULT 'primary', -- ID do calendário do Google
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

