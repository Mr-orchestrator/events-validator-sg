-- SG opensource Events Validator - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create event_logs table (replaces BigQuery)
CREATE TABLE IF NOT EXISTS event_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    field VARCHAR(255),
    error_type VARCHAR(100),
    expected TEXT,
    actual TEXT,
    value TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) NOT NULL,
    event_data TEXT,
    date_utc DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_logs_event_name ON event_logs(event_name);
CREATE INDEX IF NOT EXISTS idx_event_logs_status ON event_logs(status);
CREATE INDEX IF NOT EXISTS idx_event_logs_date_utc ON event_logs(date_utc);
CREATE INDEX IF NOT EXISTS idx_event_logs_timestamp ON event_logs(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access" ON event_logs
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create storage bucket for schemas (run in Supabase Dashboard > Storage)
-- Note: Create a bucket named 'schemas' with public access disabled

-- Grant permissions
GRANT ALL ON event_logs TO service_role;
GRANT SELECT ON event_logs TO anon;
GRANT SELECT ON event_logs TO authenticated;
