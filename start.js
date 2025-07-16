// Simple production start script
import { spawn } from 'child_process';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Start the built application
const child = spawn('node', [path.join(__dirname, 'dist/index.js')], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

child.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`Application exited with code ${code}`);
  process.exit(code);
});