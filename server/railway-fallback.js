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

// Essential API endpoints for basic functionality
app.post('/api/marketing/newsletter', (req, res) => {
  console.log('Newsletter signup attempt:', req.body);
  // Return success without database - fallback server
  res.json({ 
    message: 'Thank you for subscribing! We will add you to our newsletter.',
    status: 'success'
  });
});

app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  // Return success without database - fallback server
  res.json({ 
    message: 'Thank you for your message! We will get back to you soon.',
    status: 'success'
  });
});

app.post('/api/franchise/apply', (req, res) => {
  console.log('Franchise application:', req.body);
  // Return success without database - fallback server
  res.json({ 
    message: 'Thank you for your interest! We will review your application and contact you soon.',
    status: 'success'
  });
});

app.post('/api/loyalty/checkin', (req, res) => {
  console.log('Loyalty check-in attempt:', req.body);
  // Return success without database - fallback server
  res.json({ 
    message: 'Check-in successful! Points will be added to your account.',
    status: 'success'
  });
});

// Admin endpoints that return minimal responses
app.post('/api/admin/login', (req, res) => {
  console.log('Admin login attempt');
  res.status(401).json({ message: 'Admin dashboard not available in fallback mode' });
});

app.get('/api/admin/*', (req, res) => {
  res.status(503).json({ message: 'Admin features not available in fallback mode' });
});

// Handle all other API routes that might be missing
app.all('/api/*', (req, res) => {
  console.log(`API request not handled: ${req.method} ${req.path}`);
  res.status(404).json({ 
    message: 'API endpoint not available in fallback mode',
    path: req.path,
    method: req.method
  });
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