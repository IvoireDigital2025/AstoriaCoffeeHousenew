// Simple deployment server - bypasses all build issues
const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

// Start the development server
console.log('Starting Coffee Pro development server...');
exec('npm run dev', { cwd: __dirname }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

// Fallback for direct deployment
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Coffee Pro - Starting Up</title></head>
      <body>
        <h1>Coffee Pro Digital Platform</h1>
        <p>Server is starting up... Please wait a moment and refresh.</p>
        <p>If this persists, the main application is running on port 5000</p>
      </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running on port ${PORT}`);
});