-- Keep-alive ping table
-- Purpose: Log automated pings to prevent Supabase from pausing due to inactivity
-- The cron job writes to this table every 12 hours to ensure continuous activity

CREATE TABLE IF NOT EXISTS keep_alive_pings (
  id BIGSERIAL PRIMARY KEY,
  pinged_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'vercel-cron'
);

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_keep_alive_pings_pinged_at ON keep_alive_pings(pinged_at DESC);

-- Optional: Auto-cleanup old pings (keep only last 30 days)
-- This prevents the table from growing indefinitely
CREATE OR REPLACE FUNCTION cleanup_old_keep_alive_pings()
RETURNS void AS $$
BEGIN
  DELETE FROM keep_alive_pings 
  WHERE pinged_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Insert initial ping
INSERT INTO keep_alive_pings (source) VALUES ('manual-setup');
