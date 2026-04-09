
CREATE TABLE public.partner_quadrant_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id text NOT NULL UNIQUE,
  segment_quality_score numeric(4,1) NOT NULL DEFAULT 5.0,
  market_presence_score numeric(4,1) NOT NULL DEFAULT 5.0,
  team_size_score numeric(4,1) NOT NULL DEFAULT 5.0,
  financial_health_score numeric(4,1) NOT NULL DEFAULT 5.0,
  product_roadmap_score numeric(4,1) NOT NULL DEFAULT 5.0,
  partnership_engagement_score numeric(4,1) NOT NULL DEFAULT 5.0,
  position_override_x numeric(6,2) DEFAULT NULL,
  position_override_y numeric(6,2) DEFAULT NULL,
  notes text DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_quadrant_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on partner_quadrant_scores"
  ON public.partner_quadrant_scores
  FOR ALL
  USING (true)
  WITH CHECK (true);
