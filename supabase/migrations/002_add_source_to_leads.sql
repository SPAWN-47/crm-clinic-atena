-- Migration: Add source column to leads table
-- Version: 002
-- Date: 2026-01-03
-- Purpose: Track lead origin (manual, ia, n8n)

-- Add source column to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'n8n' CHECK (source IN ('ia', 'n8n', 'manual'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Update existing leads without source to default 'n8n'
UPDATE leads 
SET source = 'n8n' 
WHERE source IS NULL;

-- Add column comment
COMMENT ON COLUMN leads.source IS 'Origin of the lead: ia (AI automation), n8n (webhook), or manual (created by user)';

