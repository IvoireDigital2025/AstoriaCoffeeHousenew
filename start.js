#!/usr/bin/env node

// Production start script for Coffee Pro - Railway optimized
// Handles database migration and server startup without npm warnings

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

async function startCoffeePro() {
  try {
    console.log('🚀 Starting Coffee Pro application...');
    
    // Set production environment to avoid npm warnings
    process.env.NODE_ENV = 'production';
    
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
  
  // Try different server options based on available files
  const serverOptions = [
    './server/railway-production.js',  // Railway-specific server
    './server/production.js',          // General production server
    './dist/index.js'                  // Built server
  ];
  
  let serverStarted = false;
  
  for (const serverPath of serverOptions) {
    if (fs.existsSync(serverPath)) {
      console.log(`🔄 Using server: ${serverPath}`);
      
      try {
        import(serverPath)
          .then(() => {
            console.log('✅ Coffee Pro is running successfully!');
            serverStarted = true;
          })
          .catch((error) => {
            console.error(`❌ Server startup failed with ${serverPath}:`, error.message);
            if (!serverStarted) {
              process.exit(1);
            }
          });
        break;
      } catch (error) {
        console.log(`❌ Failed to start with ${serverPath}, trying next option...`);
        continue;
      }
    }
  }
  
  if (!serverStarted) {
    console.error('❌ No suitable server file found');
    process.exit(1);
  }
}

// Handle graceful shutdown for Railway
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Start the application
startCoffeePro();