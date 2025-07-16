const express = require('express');
const session = require('express-session');
const path = require('path');
const { Pool } = require('pg');
const fs = require('fs');
const connectPgSimple = require('connect-pg-simple');

// Ensure required environment variables
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET environment variable is required');
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Create PostgreSQL session store
const pgSession = connectPgSimple(session);

// Session configuration for production with database store
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'coffee-pro-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  },
  name: 'coffee-pro-session'
}));

// Serve static files
app.use('/attached_assets', express.static(path.join(__dirname, '../attached_assets')));
app.use(express.static(path.join(__dirname, '../dist/public')));

// Serve React app for all routes except API
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  const indexPath = path.join(__dirname, '../dist/public/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not found');
  }
});

// Simple API routes for basic functionality
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin authentication middleware
const requireAdminAuth = (req, res, next) => {
  console.log('Session check:', {
    sessionId: req.session?.id,
    adminAuthenticated: req.session?.adminAuthenticated,
    sessionExists: !!req.session
  });
  
  const isAuthenticated = req.session?.adminAuthenticated;
  if (!isAuthenticated) {
    return res.status(401).json({ message: "Admin authentication required" });
  }
  next();
};

// Admin login route
app.post('/api/admin/login', (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "Coffeeproegypt";
    
    console.log('Login attempt:', {
      hasPassword: !!password,
      sessionExists: !!req.session,
      sessionId: req.session?.id
    });
    
    if (password === adminPassword) {
      if (!req.session) {
        return res.status(500).json({ message: "Session not available" });
      }
      req.session.adminAuthenticated = true;
      
      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        console.log('Session saved successfully:', req.session.id);
        res.json({ message: "Login successful" });
      });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Admin logout route
app.post('/api/admin/logout', (req, res) => {
  req.session.adminAuthenticated = false;
  res.json({ message: "Logged out successfully" });
});

// Protected admin routes
app.get('/api/marketing/contacts', requireAdminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marketing_contacts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Marketing contacts error:', error);
    res.status(500).json({ message: 'Failed to fetch marketing contacts' });
  }
});

app.get('/api/contact/messages', requireAdminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Contact messages error:', error);
    res.status(500).json({ message: 'Failed to fetch contact messages' });
  }
});

app.get('/api/admin/loyalty/customers', requireAdminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loyalty_customers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Loyalty customers error:', error);
    res.status(500).json({ message: 'Failed to fetch loyalty customers' });
  }
});

app.get('/api/admin/loyalty/visits', requireAdminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loyalty_visits ORDER BY visit_date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Loyalty visits error:', error);
    res.status(500).json({ message: 'Failed to fetch loyalty visits' });
  }
});

app.get('/api/admin/loyalty/rewards', requireAdminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loyalty_rewards ORDER BY redeemed_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Loyalty rewards error:', error);
    res.status(500).json({ message: 'Failed to fetch loyalty rewards' });
  }
});

app.get('/api/admin/franchise/applications', requireAdminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM franchise_applications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Franchise applications error:', error);
    res.status(500).json({ message: 'Failed to fetch franchise applications' });
  }
});

app.get('/api/admin/notifications', requireAdminAuth, async (req, res) => {
  try {
    // Return empty array for now, or implement notification system
    res.json([]);
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// QR code admin routes
app.get('/api/admin/qr-codes', requireAdminAuth, (req, res) => {
  try {
    // Use Render service URL or fallback to localhost for development
    const baseUrl = process.env.RENDER_EXTERNAL_URL || 
                   process.env.REPLIT_DOMAIN || 
                   `https://${req.get('host')}` || 
                   'https://coffee-pro.onrender.com';
    
    res.json({
      loyaltyQR: `${baseUrl}/loyalty/checkin?token=loyalty-checkin-token`,
      websiteQR: baseUrl
    });
  } catch (error) {
    console.error('QR codes error:', error);
    res.status(500).json({ message: 'Failed to generate QR codes' });
  }
});

// Delete contact endpoint
app.delete('/api/marketing/contacts/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM marketing_contacts WHERE id = $1', [id]);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
});

// Loyalty program endpoints
app.post('/api/loyalty/register', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    if (!name || !phone || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if customer already exists by phone
    const existingCustomer = await pool.query('SELECT * FROM loyalty_customers WHERE phone = $1', [phone]);
    if (existingCustomer.rows.length > 0) {
      return res.status(400).json({ message: 'A customer with this phone number is already registered' });
    }

    const result = await pool.query(
      'INSERT INTO loyalty_customers (name, phone, email, current_points, total_visits, total_rewards) VALUES ($1, $2, $3, 0, 0, 0) RETURNING *',
      [name, phone, email]
    );

    res.json({
      message: 'Successfully registered for loyalty program!',
      customer: result.rows[0]
    });
  } catch (error) {
    console.error('Loyalty registration error:', error);
    res.status(500).json({ message: 'Failed to register for loyalty program' });
  }
});

// Distance calculation function (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// QR Code check-in endpoint
app.post('/api/loyalty/checkin', async (req, res) => {
  try {
    const { name, phone, email, latitude, longitude, timezone, localTime } = req.body;
    
    if (!name || !phone || !email) {
      return res.status(400).json({ message: 'Name, phone, and email are required' });
    }

    // Location validation
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location data is required for check-in' });
    }

    // Coffee Pro store location: 23-33 Astoria Blvd, Astoria, NY 11102
    const STORE_LOCATION = {
      latitude: 40.7709,
      longitude: -73.9207,
      radius: 100 // meters
    };

    // Calculate distance between user and store
    const distance = calculateDistance(latitude, longitude, STORE_LOCATION.latitude, STORE_LOCATION.longitude);
    
    if (distance > STORE_LOCATION.radius) {
      return res.status(403).json({ 
        message: `You must be within ${STORE_LOCATION.radius}m of Coffee Pro to check in. You are ${Math.round(distance)}m away.` 
      });
    }

    // Check if customer exists by phone
    let customerResult = await pool.query('SELECT * FROM loyalty_customers WHERE phone = $1', [phone]);
    let customer = customerResult.rows[0];
    
    if (!customer) {
      // Create new customer
      const newCustomerResult = await pool.query(
        'INSERT INTO loyalty_customers (name, phone, email, current_points, total_visits, total_rewards) VALUES ($1, $2, $3, 0, 0, 0) RETURNING *',
        [name, phone, email]
      );
      customer = newCustomerResult.rows[0];
    }

    // Use customer's local time for visit record if provided
    const visitTime = localTime ? new Date(localTime) : new Date();
    
    // Create visit record
    await pool.query(
      'INSERT INTO loyalty_visits (customer_id, visit_date, points_earned) VALUES ($1, $2, $3)',
      [customer.id, visitTime, 1]
    );

    // Update customer points and visit count
    const updatedCustomerResult = await pool.query(
      'UPDATE loyalty_customers SET total_visits = total_visits + 1, current_points = current_points + 1 WHERE id = $1 RETURNING *',
      [customer.id]
    );
    const updatedCustomer = updatedCustomerResult.rows[0];

    // Check if customer earned a free coffee (5 points)
    const earnedReward = updatedCustomer.current_points >= 5;
    
    if (earnedReward) {
      // Create reward record
      await pool.query(
        'INSERT INTO loyalty_rewards (customer_id, reward_type, points_used, redeemed_at) VALUES ($1, $2, $3, $4)',
        [customer.id, 'free_coffee', 5, new Date()]
      );
      
      // Reset current points
      await pool.query(
        'UPDATE loyalty_customers SET current_points = current_points - 5, total_rewards = total_rewards + 1 WHERE id = $1',
        [customer.id]
      );
    }

    res.json({
      message: earnedReward ? 'Congratulations! You earned a free coffee!' : 'Check-in successful!',
      customer: {
        id: updatedCustomer.id,
        name: updatedCustomer.name,
        currentPoints: earnedReward ? updatedCustomer.current_points - 5 : updatedCustomer.current_points,
        totalVisits: updatedCustomer.total_visits,
        totalRewards: earnedReward ? updatedCustomer.total_rewards + 1 : updatedCustomer.total_rewards
      },
      earnedReward,
      pointsToNextReward: earnedReward ? 5 : (5 - updatedCustomer.current_points)
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Failed to process check-in' });
  }
});

// QR token generation (admin only)
app.post('/api/qr/generate', requireAdminAuth, async (req, res) => {
  try {
    // Generate secure random token
    const tokenString = require('crypto').randomBytes(32).toString('hex');
    
    // Token expires in 60 seconds
    const expiresAt = new Date(Date.now() + 60 * 1000);
    
    // Clean up expired tokens first
    await pool.query('DELETE FROM qr_tokens WHERE expires_at < NOW()');
    
    // Store token
    await pool.query(
      'INSERT INTO qr_tokens (token, expires_at, used) VALUES ($1, $2, false)',
      [tokenString, expiresAt]
    );
    
    res.json({
      token: tokenString,
      expiresAt: expiresAt.toISOString(),
      validFor: 60 // seconds
    });
  } catch (error) {
    console.error('QR token generation error:', error);
    res.status(500).json({ message: 'Failed to generate QR token' });
  }
});

// QR token validation
app.post('/api/qr/validate', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    
    const result = await pool.query('SELECT * FROM qr_tokens WHERE token = $1', [token]);
    const qrToken = result.rows[0];
    
    if (!qrToken) {
      return res.status(404).json({ message: 'Invalid token' });
    }
    
    const now = new Date();
    
    if (qrToken.expires_at < now) {
      return res.status(400).json({ message: 'Token has expired' });
    }
    
    if (qrToken.used) {
      return res.status(400).json({ message: 'Token has already been used' });
    }
    
    // Mark token as used
    await pool.query('UPDATE qr_tokens SET used = true WHERE token = $1', [token]);
    
    res.json({ 
      valid: true, 
      message: 'Token validated successfully',
      remainingTime: Math.max(0, Math.floor((qrToken.expires_at.getTime() - now.getTime()) / 1000))
    });
  } catch (error) {
    console.error('QR token validation error:', error);
    res.status(500).json({ message: 'Failed to validate token' });
  }
});

// Franchise application endpoints
app.post('/api/franchise/apply', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      businessExperience, 
      investmentCapacity, 
      preferredLocation, 
      timelineToOpen, 
      additionalInfo 
    } = req.body;
    
    const result = await pool.query(
      'INSERT INTO franchise_applications (first_name, last_name, email, phone, business_experience, investment_capacity, preferred_location, timeline_to_open, additional_info, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [firstName, lastName, email, phone, businessExperience, investmentCapacity, preferredLocation, timelineToOpen, additionalInfo, 'pending']
    );
    
    res.json({
      message: 'Franchise application submitted successfully!',
      application: result.rows[0]
    });
  } catch (error) {
    console.error('Franchise application error:', error);
    res.status(500).json({ message: 'Failed to submit franchise application' });
  }
});

// Admin franchise application management
app.patch('/api/admin/franchise/applications/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE franchise_applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Franchise status update error:', error);
    res.status(500).json({ message: 'Failed to update franchise application status' });
  }
});

app.delete('/api/admin/franchise/applications/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM franchise_applications WHERE id = $1', [id]);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Franchise delete error:', error);
    res.status(500).json({ message: 'Failed to delete franchise application' });
  }
});

// Admin loyalty reward redemption
app.post('/api/admin/loyalty/redeem', requireAdminAuth, async (req, res) => {
  try {
    const { customerId, notes } = req.body;
    
    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    const customerResult = await pool.query('SELECT * FROM loyalty_customers WHERE id = $1', [customerId]);
    const customer = customerResult.rows[0];
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.current_points < 5) {
      return res.status(400).json({ message: 'Customer doesn\'t have enough points for a reward' });
    }

    // Create reward record
    await pool.query(
      'INSERT INTO loyalty_rewards (customer_id, reward_type, points_used, notes, redeemed_at) VALUES ($1, $2, $3, $4, $5)',
      [customer.id, 'free_coffee', 5, notes, new Date()]
    );
    
    // Update customer points
    const updatedResult = await pool.query(
      'UPDATE loyalty_customers SET current_points = current_points - 5, total_rewards = total_rewards + 1 WHERE id = $1 RETURNING *',
      [customer.id]
    );

    res.json({
      message: 'Reward redeemed successfully',
      customer: updatedResult.rows[0]
    });
  } catch (error) {
    console.error('Loyalty redemption error:', error);
    res.status(500).json({ message: 'Failed to redeem reward' });
  }
});

// Newsletter subscription
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, name, phone, source } = req.body;
    await pool.query(
      'INSERT INTO marketing_contacts (email, name, phone, source) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      [email, name, phone, source]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Marketing newsletter subscription (alternative endpoint)
app.post('/api/marketing/newsletter', async (req, res) => {
  try {
    const { email, name, phone, source } = req.body;
    const result = await pool.query(
      'INSERT INTO marketing_contacts (email, name, phone, source, subscribed) VALUES ($1, $2, $3, $4, true) ON CONFLICT (email) DO UPDATE SET subscribed = true, name = COALESCE(EXCLUDED.name, marketing_contacts.name), phone = COALESCE(EXCLUDED.phone, marketing_contacts.phone) RETURNING *',
      [email, name, phone, source || 'newsletter']
    );
    res.json({ 
      message: 'Successfully subscribed to our newsletter!',
      contact: result.rows[0]
    });
  } catch (error) {
    console.error('Marketing newsletter error:', error);
    res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone, subject, message]
    );
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});



// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Coffee Pro server running on port ${PORT}`);
});