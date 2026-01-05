-- Add new columns to existing work_experiences table
-- Run this in Supabase SQL Editor if you already have data

ALTER TABLE work_experiences 
ADD COLUMN IF NOT EXISTS responsibilities TEXT[],
ADD COLUMN IF NOT EXISTS technologies TEXT[];
