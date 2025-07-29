// Database-enabled fallback server for Railway deployment
// Uses PostgreSQL database storage for all customer interactions

import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import connectPgSimple from "connect-pg-simple";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Initialize database connection and storage
let pool, storage;

try {
  const { pool: dbPool } = await import("./db.js");
  const { storage: dbStorage } = await import("./database-storage.js");
  pool = dbPool;
  storage = dbStorage;
  console.log("✅ Database connection established");
} catch (error) {
  console.error("❌ Database initialization failed:", error.message);
  process.exit(1);
}

// Session middleware with PostgreSQL store
const PgSession = connectPgSimple(session);
app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'CoffeePro2024SecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

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

// Admin authentication helper
const requireAdminAuth = (req, res, next) => {
  if (req.session && req.session.adminAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: "Admin authentication required" });
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Coffee Pro database server is running' });
});

// Newsletter signup with database storage
app.post('/api/marketing/newsletter', async (req, res) => {
  console.log('Newsletter subscription request:', { body: req.body, hasEmail: !!req.body.email });
  
  try {
    const { email, name, source } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log('Parsed contact data:', { email, source });

    // Check if already subscribed
    const existingContact = await storage.getMarketingContactByEmail(email);
    console.log('Existing contact found:', existingContact ? { subscribed: existingContact.subscribed } : null);
    
    if (existingContact) {
      if (existingContact.subscribed) {
        return res.status(400).json({ message: "You're already subscribed to our newsletter!" });
      } else {
        // Resubscribe existing contact
        await storage.updateMarketingContactSubscription(email, true);
        return res.json({ message: "Welcome back! You've been resubscribed to our newsletter." });
      }
    }

    // Create new contact
    await storage.createMarketingContact({
      email,
      name: name || null,
      source: source || 'newsletter',
      subscribed: true
    });

    res.json({ message: "Thank you for subscribing to our newsletter!" });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: "Failed to subscribe. Please try again." });
  }
});

// Contact form with database storage
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contactMessage = await storage.createContactMessage({
      name,
      email,
      subject,
      message
    });

    res.json({ message: "Message sent successfully", id: contactMessage.id });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: "Failed to send message. Please try again." });
  }
});

// Franchise application with database storage
app.post('/api/franchise/apply', async (req, res) => {
  try {
    const applicationData = req.body;
    
    const application = await storage.createFranchiseApplication(applicationData);
    res.json({ message: "Application submitted successfully!", id: application.id });
  } catch (error) {
    console.error('Franchise application error:', error);
    res.status(500).json({ message: "Failed to submit application. Please try again." });
  }
});

// Loyalty check-in with database storage and location validation
app.post('/api/loyalty/checkin', async (req, res) => {
  try {
    const { name, phone, email, latitude, longitude, qrToken } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Name, phone, and email are required" });
    }

    // Validate QR token
    if (!qrToken) {
      return res.status(400).json({ message: "QR token is required. Please scan the QR code first." });
    }

    const token = await storage.getQrToken(qrToken);
    if (!token) {
      return res.status(400).json({ message: "Invalid QR code. Please scan the QR code displayed in the store." });
    }

    if (token.used) {
      return res.status(400).json({ message: "This QR code has already been used." });
    }

    if (token.expiresAt < new Date()) {
      return res.status(400).json({ message: "QR code has expired. Please scan again." });
    }

    // Location validation
    if (latitude && longitude) {
      const storeLatitude = 40.7649;
      const storeLongitude = -73.9137;
      const distance = haversineDistance(latitude, longitude, storeLatitude, storeLongitude);
      
      if (distance > 100) {
        return res.status(400).json({ 
          message: "You must be at Coffee Pro location to check in. Please visit us at 23-33 Astoria Blvd, Astoria, NY."
        });
      }
    }

    // Find or create customer
    let customer = await storage.getLoyaltyCustomerByPhone(phone);
    
    if (!customer) {
      customer = await storage.createLoyaltyCustomer({
        name,
        phone,
        email,
        totalVisits: 0,
        currentPoints: 0,
        totalRewards: 0
      });
    }

    // Add visit and points
    await storage.createLoyaltyVisit({
      customerId: customer.id,
      pointsEarned: 1
    });

    // Update customer
    await storage.updateLoyaltyCustomer(customer.id, {
      totalVisits: customer.totalVisits + 1,
      currentPoints: customer.currentPoints + 1
    });

    // Mark token as used
    await storage.markQrTokenAsUsed(qrToken);

    res.json({ 
      message: "Check-in successful! You earned 1 point.", 
      points: customer.currentPoints + 1,
      totalVisits: customer.totalVisits + 1
    });
  } catch (error) {
    console.error('Loyalty check-in error:', error);
    res.status(500).json({ message: "Check-in failed. Please try again." });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  
  if (password === "Coffeeproegypt") {
    req.session.adminAuthenticated = true;
    res.json({ message: "Admin authenticated successfully" });
  } else {
    res.status(401).json({ message: "Invalid admin password" });
  }
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  req.session.adminAuthenticated = false;
  res.json({ message: "Logged out successfully" });
});

// Admin data endpoints
app.get('/api/admin/marketing/contacts', requireAdminAuth, async (req, res) => {
  try {
    const contacts = await storage.getAllMarketingContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/contact/messages', requireAdminAuth, async (req, res) => {
  try {
    const messages = await storage.getContactMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/loyalty/customers', requireAdminAuth, async (req, res) => {
  try {
    const customers = await storage.getAllLoyaltyCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/franchise/applications', requireAdminAuth, async (req, res) => {
  try {
    const applications = await storage.getAllFranchiseApplications();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// QR token generation for admin
app.post('/api/admin/generate-qr-token', requireAdminAuth, async (req, res) => {
  try {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds

    await storage.createQrToken({
      token,
      expiresAt
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete operations for admin
app.delete('/api/admin/marketing/contacts/:id', requireAdminAuth, async (req, res) => {
  try {
    await storage.deleteMarketingContact(parseInt(req.params.id));
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/admin/contact/messages/:id', requireAdminAuth, async (req, res) => {
  try {
    await storage.deleteContactMessage(parseInt(req.params.id));
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Haversine distance function for location validation
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

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
  console.log(`🚀 Coffee Pro database server running on port ${port}`);
  console.log(`🗄️ Database: Connected with full functionality`);
  console.log(`👥 Features: Newsletter, Contact, Franchise, Loyalty, Admin Dashboard`);
});