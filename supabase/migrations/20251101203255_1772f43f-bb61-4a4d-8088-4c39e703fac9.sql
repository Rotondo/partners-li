-- Create alerts table for health monitoring
CREATE TABLE public.partner_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts"
ON public.partner_alerts
FOR SELECT
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own alerts"
ON public.partner_alerts
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own alerts"
ON public.partner_alerts
FOR UPDATE
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own alerts"
ON public.partner_alerts
FOR DELETE
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_partner_alerts_updated_at
BEFORE UPDATE ON public.partner_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_partner_alerts_partner_id ON public.partner_alerts(partner_id);
CREATE INDEX idx_partner_alerts_user_id ON public.partner_alerts(user_id);
CREATE INDEX idx_partner_alerts_is_read ON public.partner_alerts(is_read);
CREATE INDEX idx_partner_alerts_severity ON public.partner_alerts(severity);