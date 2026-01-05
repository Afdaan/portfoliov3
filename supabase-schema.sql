-- Portfolio Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT,
  role TEXT,
  description TEXT,
  email TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Work experiences table
CREATE TABLE IF NOT EXISTS work_experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  responsibilities TEXT[], -- Array of responsibilities
  technologies TEXT[], -- Array of technologies used
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tech stack table
CREATE TABLE IF NOT EXISTS tech_stack (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_url TEXT,
  proficiency INTEGER CHECK (proficiency >= 1 AND proficiency <= 5),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[],
  status TEXT DEFAULT 'Completed',
  start_date DATE,
  end_date DATE,
  demo_url TEXT,
  github_url TEXT,
  image_urls TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Public work experiences are viewable by everyone" ON work_experiences
  FOR SELECT USING (true);

CREATE POLICY "Public education is viewable by everyone" ON education
  FOR SELECT USING (true);

CREATE POLICY "Public tech stack is viewable by everyone" ON tech_stack
  FOR SELECT USING (true);

CREATE POLICY "Public projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

-- Authenticated users can insert/update/delete (admin only)
CREATE POLICY "Authenticated users can manage profiles" ON profiles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage work experiences" ON work_experiences
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage education" ON education
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage tech stack" ON tech_stack
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for images (run this separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);

-- Storage policies for portfolio-images bucket
-- CREATE POLICY "Public images are viewable by everyone" ON storage.objects
--   FOR SELECT USING (bucket_id = 'portfolio-images');

-- CREATE POLICY "Authenticated users can upload images" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

-- CREATE POLICY "Authenticated users can delete images" ON storage.objects
--   FOR DELETE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
