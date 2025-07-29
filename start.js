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
    await startServer();
    
  } catch (error) {
    console.error('❌ Failed to start Coffee Pro:', error.message);
    process.exit(1);
  }
}

async function startServer() {
  console.log('🌐 Starting Coffee Pro server...');
  
  // Get absolute paths for Railway environment
  const currentDir = process.cwd();
  console.log(`📍 Current directory: ${currentDir}`);
  
  // Try different server options with absolute paths
  const serverOptions = [
    path.join(currentDir, 'server', 'railway-fallback.js'),  // Updated fallback with API endpoints
    path.join(currentDir, 'server', 'production.js'),
    path.join(currentDir, 'server', 'railway-production.js'),
    path.join(currentDir, 'dist', 'index.js')
  ];
  
  console.log('🔍 Checking for server files...');
  for (const serverPath of serverOptions) {
    console.log(`  📋 Checking: ${serverPath} - ${fs.existsSync(serverPath) ? 'EXISTS' : 'NOT FOUND'}`);
  }
  
  let serverStarted = false;
  
  for (const serverPath of serverOptions) {
    if (fs.existsSync(serverPath)) {
      console.log(`🔄 Using server: ${serverPath}`);
      
      try {
        await import(serverPath);
        console.log('✅ Coffee Pro is running successfully!');
        serverStarted = true;
        break;
      } catch (error) {
        console.error(`❌ Server startup failed with ${serverPath}:`, error.message);
        console.error(`   Stack: ${error.stack}`);
        continue;
      }
    }
  }
  
  if (!serverStarted) {
    console.error('❌ No suitable server file found');
    console.log('📁 Available files in current directory:');
    try {
      const files = fs.readdirSync(currentDir);
      console.log('  Root files:', files.filter(f => f.includes('.js') || f.includes('server')));
      
      if (fs.existsSync(path.join(currentDir, 'server'))) {
        const serverFiles = fs.readdirSync(path.join(currentDir, 'server'));
        console.log('  Server files:', serverFiles);
      }
    } catch (err) {
      console.log('  Could not read directory structure');
    }
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