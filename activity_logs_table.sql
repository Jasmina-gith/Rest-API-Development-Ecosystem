-- Create activity_logs table in Supabase SQL Editor
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own logs
CREATE POLICY user_insert ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own logs
CREATE POLICY user_select ON activity_logs FOR SELECT USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
