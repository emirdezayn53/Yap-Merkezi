/**
 * Database Initialization Script
 * Run with: npm run db:init
 * Creates all required tables for the Construction Calculator Suite
 */

require('dotenv').config();
const pool = require('../config/db');

const initSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(255),
  company       VARCHAR(255),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PROJECTS TABLE ====================
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_name  VARCHAR(255) NOT NULL,
  description   TEXT,
  status        VARCHAR(50) DEFAULT 'active',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user-based project lookup
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- ==================== CALCULATIONS TABLE ====================
CREATE TABLE IF NOT EXISTS calculations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  calculator_type VARCHAR(50) NOT NULL,
  input_data      JSONB NOT NULL,
  result_data     JSONB NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_calculations_project_id ON calculations(project_id);
CREATE INDEX IF NOT EXISTS idx_calculations_user_id ON calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_calculations_type ON calculations(calculator_type);

-- ==================== UPDATED_AT TRIGGER ====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to projects table
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function initDatabase() {
  try {
    console.log('🔧 Initializing database schema...');
    await pool.query(initSQL);
    console.log('✅ Database schema created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

initDatabase();
