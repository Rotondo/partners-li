-- Add google_event_id to partner_activities for tracking
ALTER TABLE public.partner_activities
ADD COLUMN IF NOT EXISTS google_event_id TEXT,
ADD COLUMN IF NOT EXISTS google_calendar_synced BOOLEAN DEFAULT false;

-- Add index for google_event_id lookups
CREATE INDEX IF NOT EXISTS idx_partner_activities_google_event_id 
ON public.partner_activities(google_event_id) 
WHERE google_event_id IS NOT NULL;

COMMENT ON COLUMN public.partner_activities.google_event_id IS 'ID do evento no Google Calendar (para evitar duplicatas)';