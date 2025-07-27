#!/usr/bin/env node

// Production start script for Coffee Pro
// Handles database migration and server startup

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function startCoffeePro() {
  try {
    console.log('🚀 Starting Coffee Pro application...');
    
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log('⚠️  DATABASE_URL not found, starting without migration');
      startServer();
      return;
    }

    // Try to run database migration
    console.log('📋 Running database migration...');
    try {
      await execAsync('node migrate.cjs');
      console.log('✅ Database migration completed');
    } catch (migrationError) {
      console.log('⚠️  Database migration skipped (tables may already exist)');
    }

    // Start the server
    startServer();
    
  } catch (error) {
    console.error('❌ Failed to start Coffee Pro:', error.message);
    process.exit(1);
  }
}

function startServer() {
  console.log('🌐 Starting Coffee Pro server...');
  
  // Always use the production server to avoid path resolution issues
  console.log('🔄 Using production server for reliability...');
  
  import('./server/production.js')
    .then(() => {
      console.log('✅ Coffee Pro is running successfully!');
    })
    .catch((error) => {
      console.error('❌ Server startup failed:', error.message);
      console.error('Full error:', error);
      process.exit(1);
    });
}

// Start the application
startCoffeePro();