
-- Create a storage bucket for asset bills
INSERT INTO storage.buckets (id, name, public)
VALUES ('asset-bills', 'Asset Bills', true)
ON CONFLICT (id) DO NOTHING;

-- Add a policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload asset bills"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'asset-bills');

-- Add a policy to allow anyone to download asset bills
CREATE POLICY "Allow public access to asset bills"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'asset-bills');
