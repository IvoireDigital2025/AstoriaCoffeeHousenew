// Simple fallback server for Railway deployment
// Uses minimal imports to ensure compatibility

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
const publicPath = path.join(__dirname, '..', 'dist', 'public');
const assetsPath = path.join(__dirname, '..', 'attached_assets');

app.use(express.static(publicPath));
app.use('/attached_assets', express.static(assetsPath));

console.log(`📁 Serving static files from: ${publicPath}`);
console.log(`🖼️ Serving assets from: ${assetsPath}`);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Coffee Pro server is running' });
});

// Catch-all route to serve index.html for SPA
app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Server Error');
    }
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Coffee Pro fallback server running on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});