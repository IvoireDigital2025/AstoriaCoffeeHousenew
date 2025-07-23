#!/usr/bin/env node

// Optimized build script for Render deployment
// Handles memory constraints and large builds

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting optimized build process...');

// Set Node.js memory options
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Function to run command with proper error handling
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function build() {
  try {
    // Step 1: Build frontend with memory optimization
    console.log('📦 Building frontend...');
    await runCommand('npx', ['vite', 'build'], {
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=4096'
      }
    });
    
    // Step 2: Build backend
    console.log('🔧 Building backend...');
    await runCommand('npx', ['esbuild', 'server/index.ts', 
      '--platform=node', 
      '--packages=external', 
      '--bundle', 
      '--format=esm', 
      '--outdir=dist'
    ]);
    
    // Step 3: Copy production files
    console.log('📋 Copying production files...');
    
    // Ensure dist directory exists
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }
    
    // Copy production.js to dist for fallback
    if (fs.existsSync('server/production.js')) {
      fs.copyFileSync('server/production.js', 'dist/production.js');
    }
    
    console.log('✅ Build completed successfully!');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run the build
build();