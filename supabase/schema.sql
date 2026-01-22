-- Supabase Database Schema for a-m.ae Townhouse Homepage
-- Run this in your Supabase SQL Editor to set up the database

-- Table: status
-- Purpose: Store the homepage banner message that can be updated via Telegram bot
CREATE TABLE IF NOT EXISTS status (
  id INTEGER PRIMARY KEY,
  message TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default status message
INSERT INTO status (id, message, updated_at)
VALUES (1, 'Welcome to our townhouse! Feel free to explore and leave a message.', NOW())
ON CONFLICT (id) DO NOTHING;

-- Table: scan_events
-- Purpose: Log visits to the /h page for analytics and notifications
CREATE TABLE IF NOT EXISTS scan_events (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  path TEXT NOT NULL,
  ip_hash TEXT,
  ua_hash TEXT
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_scan_events_created_at ON scan_events(created_at DESC);

-- Table: guestbook_entries
-- Purpose: Store messages and photos from guests (Phase B implementation)
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  photo_url TEXT,
  published BOOLEAN DEFAULT FALSE
);

-- Index for published entries
CREATE INDEX IF NOT EXISTS idx_guestbook_published ON guestbook_entries(published, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE status ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Status: Allow public read access
CREATE POLICY "Allow public read access to status"
  ON status FOR SELECT
  USING (true);

-- Status: Allow service role to update
CREATE POLICY "Allow service role to update status"
  ON status FOR UPDATE
  USING (true);

-- Scan events: Allow service role full access
CREATE POLICY "Allow service role to manage scan events"
  ON scan_events FOR ALL
  USING (true);

-- Guestbook: Allow public to read published entries
CREATE POLICY "Allow public to read published guestbook entries"
  ON guestbook_entries FOR SELECT
  USING (published = true);

-- Guestbook: Allow service role full access
CREATE POLICY "Allow service role to manage guestbook"
  ON guestbook_entries FOR ALL
  USING (true);

-- Storage bucket for guestbook photos
-- IMPORTANT: Create this bucket in Supabase Dashboard > Storage
-- 1. Go to Storage section
-- 2. Create a new bucket named "guestbook-photos"
-- 3. Make it PUBLIC (allow public access to read files)
-- 4. File size limit: 5MB per file
-- 5. Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp, image/heic
-- 
-- Alternative: Run this SQL to create policies (after creating bucket manually in UI):
-- CREATE POLICY "Public read access for guestbook photos"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'guestbook-photos');
-- 
-- CREATE POLICY "Authenticated upload for guestbook photos"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'guestbook-photos');
