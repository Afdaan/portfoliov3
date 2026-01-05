-- Run this in your Supabase SQL Editor to set up Image Storage

-- 1. Create a public storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create policy to allow public viewing of images
CREATE POLICY "Public images are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

-- 3. Create policy to allow authenticated users (admin) to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

-- 4. Create policy to allow authenticated users (admin) to delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
