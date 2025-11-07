-- Add logo_url column to partners table
ALTER TABLE partners 
ADD COLUMN logo_url TEXT;

-- Create storage bucket for partner logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'partner-logos',
  'partner-logos',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
);

-- RLS policies for partner-logos bucket
CREATE POLICY "Users can upload their partner logos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'partner-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their partner logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'partner-logos');

CREATE POLICY "Users can update their partner logos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'partner-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their partner logos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'partner-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);