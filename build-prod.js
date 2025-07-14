#!/usr/bin/env node
// Production build script that avoids Replit-specific plugins

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting production build...');

try {
  // Use the production vite config
  console.log('Building frontend...');
  execSync('npx vite build --config vite.config.prod.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}