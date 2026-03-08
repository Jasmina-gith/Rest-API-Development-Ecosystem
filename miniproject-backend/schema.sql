-- =====================================================
-- REST API Development Ecosystem - Complete Database Schema
-- Compatible with Supabase (PostgreSQL)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Users Table
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Projects Table
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    state TEXT DEFAULT '[]', -- Stores JSON string of tabs/requests
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Collaborators Table (Many-to-Many: Users <-> Projects)
-- =====================================================
CREATE TABLE IF NOT EXISTS collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    is_owner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id) -- Prevent duplicate collaborators
);

-- =====================================================
-- Audit Logs Table
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    username VARCHAR(255),
    details TEXT, -- JSON string for additional context
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Collaborators indexes
CREATE INDEX IF NOT EXISTS idx_collaborators_project_id ON collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_project_user ON collaborators(project_id, user_id);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_username ON audit_logs(username);

-- =====================================================
-- Row Level Security (RLS) - Optional for Supabase
-- =====================================================

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can read all users
CREATE POLICY "Users can view all users" ON users
    FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = user_id);

-- Projects: Collaborators can view their projects
CREATE POLICY "Collaborators can view their projects" ON projects
    FOR SELECT USING (
        project_id IN (
            SELECT project_id FROM collaborators 
            WHERE user_id = auth.uid()
        )
    );

-- Projects: Owners can update their projects
CREATE POLICY "Owners can update projects" ON projects
    FOR UPDATE USING (
        project_id IN (
            SELECT project_id FROM collaborators 
            WHERE user_id = auth.uid() AND is_owner = true
        )
    );

-- =====================================================
-- Tokens Table (for refresh tokens)
-- =====================================================
CREATE TABLE IF NOT EXISTS tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(500) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Tokens indexes
CREATE INDEX IF NOT EXISTS idx_tokens_token ON tokens(token);
CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON tokens(user_id);

-- Enable RLS on tokens
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tokens" ON tokens
    FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- Insert sample user (password: 'test123')
-- Note: In production, use proper password hashing!
INSERT INTO users (username, email, password_hash) 
VALUES ('testuser', 'test@example.com', '$2a$10$placeholder')
ON CONFLICT (username) DO NOTHING;

