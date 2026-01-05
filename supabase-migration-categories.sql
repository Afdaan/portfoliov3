-- Migration to update Tech Stack categories
-- Run this in your Supabase SQL Editor

-- 1. Create the 'Databases' category by moving known database technologies
UPDATE tech_stack
SET category = 'Databases'
WHERE name ILIKE ANY (ARRAY[
  '%Postgre%', 
  '%SQL%', 
  '%Mongo%', 
  '%Redis%', 
  '%Firebase%', 
  '%Supabase%', 
  '%Cassandra%', 
  '%MariaDB%', 
  '%Oracle%', 
  '%DynamoDB%'
]);

-- 2. Create the 'Programming Languages' category by moving known languages
UPDATE tech_stack
SET category = 'Programming Languages'
WHERE name ILIKE ANY (ARRAY[
  'JavaScript', 
  'TypeScript', 
  'Python', 
  'Java', 
  'C++', 
  'C#', 
  'Go', 
  'Golang', 
  'Rust', 
  'PHP', 
  'Ruby', 
  'Swift', 
  'Kotlin'
]);

-- 3. Ensure 'Cloud' category captures common cloud providers if not already set
UPDATE tech_stack
SET category = 'Cloud'
WHERE name ILIKE ANY (ARRAY[
  '%AWS%', 
  '%Azure%', 
  '%Google Cloud%', 
  '%GCP%', 
  '%DigitalOcean%', 
  '%Heroku%', 
  '%Vercel%', 
  '%Netlify%', 
  '%Linode%'
]);
