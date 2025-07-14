// Simple production starter for Railway/Vercel
const { spawn } = require('child_process');

console.log('Starting Coffee Pro server...');

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Start the TypeScript server directly
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: process.env
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  server.kill('SIGTERM');
});