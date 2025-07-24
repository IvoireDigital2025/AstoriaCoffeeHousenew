#!/usr/bin/env node

// Direct database migration script for Render deployment
// Creates all tables manually when drizzle-kit is not available

import { Pool } from 'pg';

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// SQL to create all required tables
const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  image TEXT,
  available BOOLEAN NOT NULL DEFAULT true
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Marketing contacts table
CREATE TABLE IF NOT EXISTS marketing_contacts (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  name TEXT,
  source TEXT NOT NULL,
  preferences TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  filename TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Loyalty customers table
CREATE TABLE IF NOT EXISTS loyalty_customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  total_visits INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0,
  total_rewards INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Loyalty visits table
CREATE TABLE IF NOT EXISTS loyalty_visits (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES loyalty_customers(id),
  visit_date TIMESTAMP DEFAULT NOW(),
  points_earned INTEGER DEFAULT 1,
  notes TEXT
);

-- Loyalty rewards table
CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES loyalty_customers(id),
  reward_type VARCHAR(100) DEFAULT 'free_coffee',
  points_used INTEGER DEFAULT 5,
  redeemed_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- Franchise applications table
CREATE TABLE IF NOT EXISTS franchise_applications (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  business_experience TEXT NOT NULL,
  investment_capacity VARCHAR(50) NOT NULL,
  preferred_location VARCHAR(255) NOT NULL,
  timeline_to_open VARCHAR(50) NOT NULL,
  additional_info TEXT,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- User sessions table (for admin authentication)
CREATE TABLE IF NOT EXISTS user_sessions (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marketing_contacts_email ON marketing_contacts(email);
CREATE INDEX IF NOT EXISTS idx_loyalty_customers_email ON loyalty_customers(email);
CREATE INDEX IF NOT EXISTS idx_loyalty_visits_customer_id ON loyalty_visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_franchise_applications_status ON franchise_applications(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expire ON user_sessions(expire);
`;

async function createTables() {
  try {
    console.log('🔄 Connecting to database...');
    const client = await pool.connect();
    
    console.log('📋 Creating database tables...');
    await client.query(createTablesSQL);
    
    console.log('✅ All database tables created successfully!');
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📊 Created tables:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    client.release();
    await pool.end();
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Database migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the migration
createTables();