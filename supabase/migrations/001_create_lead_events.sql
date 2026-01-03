-- Migration: Create lead_events table
-- MVP: Simple event tracking for leads

CREATE TABLE IF NOT EXISTS lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  payload JSONB,
  source VARCHAR(20) NOT NULL CHECK (source IN ('ia', 'n8n', 'manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON lead_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_events_type ON lead_events(type);
CREATE INDEX IF NOT EXISTS idx_lead_events_created_at ON lead_events(created_at DESC);

-- Enable Row Level Security (optional, adjust policies as needed)
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to insert events (for Edge Functions)
CREATE POLICY "Allow service role insert" ON lead_events
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow authenticated users to read events
CREATE POLICY "Allow authenticated read" ON lead_events
  FOR SELECT
  USING (true);

-- Policy: Allow service role to read events
CREATE POLICY "Allow service role read" ON lead_events
  FOR SELECT
  USING (true);

-- Comment on table
COMMENT ON TABLE lead_events IS 'Event tracking system for leads - MVP v1';
COMMENT ON COLUMN lead_events.type IS 'Event type: lead_created, lead_updated, status_changed, message_received, etc.';
COMMENT ON COLUMN lead_events.payload IS 'Optional JSON payload with event-specific data';
COMMENT ON COLUMN lead_events.source IS 'Source of the event: ia, n8n, or manual';

