import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./database-storage";
import { notificationService } from "./notifications";
import { 
  insertUserSchema, 
  insertContactMessageSchema,
  insertMarketingContactSchema,
  insertLoyaltyCustomerSchema,
  insertLoyaltyVisitSchema,
  insertLoyaltyRewardSchema,
  insertFranchiseApplicationSchema,
  insertQrTokenSchema
} from "@shared/schema";
import { randomBytes } from "crypto";

// Distance calculation function (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Admin authentication middleware
  const requireAdminAuth = (req: any, res: any, next: any) => {
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
  
  // User/Loyalty routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/users/:id/points", async (req, res) => {
    try {
      const { id } = req.params;
      const { points } = req.body;
      
      if (typeof points !== 'number') {
        return res.status(400).json({ message: "Points must be a number" });
      }
      
      const user = await storage.updateUserPoints(parseInt(id), points);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Menu routes
  app.get("/api/menu", async (req, res) => {
    try {
      const { category } = req.query;
      
      let menuItems;
      if (category && typeof category === 'string') {
        menuItems = await storage.getMenuItemsByCategory(category);
      } else {
        menuItems = await storage.getMenuItems();
      }
      
      res.json(menuItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.json({ message: "Message sent successfully", id: message.id });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/contact/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contact ID" });
      }
      
      await storage.deleteContactMessage(id);
      res.json({ message: "Contact message deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });



  // Marketing Contact routes
  app.post("/api/marketing/newsletter", async (req, res) => {
    try {
      console.log('Newsletter subscription request:', { body: req.body, hasEmail: !!req.body?.email });
      
      const contactData = insertMarketingContactSchema.parse({
        ...req.body,
        source: "newsletter"
      });
      
      console.log('Parsed contact data:', { email: contactData.email, source: contactData.source });
      
      // Check if email already exists
      const existingContact = await storage.getMarketingContactByEmail(contactData.email);
      if (existingContact) {
        console.log('Existing contact found:', { subscribed: existingContact.subscribed });
        if (!existingContact.subscribed) {
          // Resubscribe existing contact
          const updatedContact = await storage.updateMarketingContactSubscription(contactData.email, true);
          return res.json({ 
            message: "Successfully resubscribed to our newsletter!",
            contact: updatedContact
          });
        }
        return res.status(400).json({ message: "You're already subscribed to our newsletter!" });
      }
      
      console.log('Creating new marketing contact...');
      const contact = await storage.createMarketingContact(contactData);
      console.log('Marketing contact created:', { id: contact.id, email: contact.email });
      
      res.json({ 
        message: "Successfully subscribed to our newsletter!",
        contact: contact
      });
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      res.status(400).json({ message: error.message || "Failed to subscribe to newsletter" });
    }
  });

  app.post("/api/marketing/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const contact = await storage.updateMarketingContactSubscription(email, false);
      if (!contact) {
        return res.status(404).json({ message: "Email not found in our system" });
      }
      
      res.json({ 
        message: "Successfully unsubscribed from our newsletter",
        contact: contact
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin login endpoint
  app.post("/api/admin/login", (req: any, res) => {
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
        req.session.save((err: any) => {
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
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Server error during login" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", (req: any, res) => {
    req.session.adminAuthenticated = false;
    res.json({ message: "Logged out successfully" });
  });

  // Admin authentication check endpoint
  app.get("/api/admin/check", (req: any, res) => {
    console.log('Authentication check:', {
      sessionId: req.session?.id,
      adminAuthenticated: req.session?.adminAuthenticated,
      sessionExists: !!req.session
    });
    
    const isAuthenticated = req.session?.adminAuthenticated || false;
    res.json({ 
      authenticated: isAuthenticated,
      message: isAuthenticated ? "Authenticated" : "Not authenticated"
    });
  });

  // Protected admin route to get all marketing contacts
  app.get("/api/marketing/contacts", requireAdminAuth, async (req, res) => {
    try {
      const contacts = await storage.getAllMarketingContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/marketing/contacts", requireAdminAuth, async (req, res) => {
    try {
      const contacts = await storage.getAllMarketingContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Protected admin route to get all contact messages
  app.get("/api/contact/messages", requireAdminAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/contact/messages", requireAdminAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Loyalty program routes
  
  // Registration endpoint (for customers to join online)
  app.post("/api/loyalty/register", async (req, res) => {
    try {
      const { name, phone, email } = req.body;
      
      if (!name || !phone || !email) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if customer already exists by phone
      const existingCustomer = await storage.getLoyaltyCustomerByPhone(phone);
      if (existingCustomer) {
        return res.status(400).json({ message: "A customer with this phone number is already registered" });
      }

      const customer = await storage.createLoyaltyCustomer({
        name,
        phone,
        email
      });

      res.json({ 
        message: "Successfully registered for loyalty program!",
        customer: {
          id: customer.id,
          name: customer.name,
          currentPoints: customer.currentPoints,
          totalVisits: customer.totalVisits,
          totalRewards: customer.totalRewards,
        }
      });
    } catch (error) {
      console.error("Error registering for loyalty program:", error);
      res.status(500).json({ message: "Failed to register for loyalty program" });
    }
  });
  
  // QR Code check-in endpoint (for customers)
  app.post("/api/loyalty/checkin", async (req, res) => {
    try {
      const { name, phone, email, timezone, localTime } = req.body;
      
      if (!name || !phone || !email) {
        return res.status(400).json({ message: "Name, phone, and email are required" });
      }

      // Check if customer exists by phone (primary identifier)
      let customer = await storage.getLoyaltyCustomerByPhone(phone);
      
      if (!customer) {
        // Create new customer
        customer = await storage.createLoyaltyCustomer({ name, phone, email });
      }

      // Check for recent check-ins (prevent multiple check-ins within 2 hours)
      // Get all visits for this customer and filter recent ones
      const allVisits = await storage.getLoyaltyVisitsByCustomer(customer.id);
      const cutoffTime = new Date(Date.now() - (2 * 60 * 60 * 1000)); // 2 hours ago
      const recentVisits = allVisits.filter(visit => 
        visit.visitDate && new Date(visit.visitDate) > cutoffTime
      );
      
      if (recentVisits && recentVisits.length > 0) {
        const lastVisit = recentVisits[0];
        const timeSinceLastVisit = Date.now() - new Date(lastVisit.visitDate).getTime();
        const hoursAgo = Math.floor(timeSinceLastVisit / (1000 * 60 * 60));
        const minutesAgo = Math.floor((timeSinceLastVisit % (1000 * 60 * 60)) / (1000 * 60));
        
        return res.status(429).json({ 
          message: `You've already checked in recently! Thank you for visiting Coffee Pro. Please come back later for your next check-in.`,
          lastCheckIn: lastVisit.visitDate,
          canCheckInAgain: "in a couple hours",
          timeSinceLastVisit: hoursAgo > 0 ? `${hoursAgo} hours ago` : `${minutesAgo} minutes ago`
        });
      }

      // Use customer's local time for visit record if provided
      const visitTime = localTime ? new Date(localTime) : new Date();
      
      // Create visit record with customer's local time
      const visit = await storage.createLoyaltyVisit({
        customerId: customer.id,
        pointsEarned: 1,
        visitDate: visitTime,
      });

      // Update customer points and visit count
      const updatedCustomer = await storage.updateLoyaltyCustomer(customer.id, {
        totalVisits: (customer.totalVisits || 0) + 1,
        currentPoints: (customer.currentPoints || 0) + 1,
      });

      // Check if customer earned a free coffee (5 points)
      const earnedReward = updatedCustomer && (updatedCustomer.currentPoints || 0) >= 5;
      
      if (earnedReward) {
        // Create reward record
        await storage.createLoyaltyReward({
          customerId: customer.id,
          rewardType: "free_coffee",
          pointsUsed: 5,
        });
        
        // Reset current points
        await storage.updateLoyaltyCustomer(customer.id, {
          currentPoints: (updatedCustomer.currentPoints || 0) - 5,
          totalRewards: (updatedCustomer.totalRewards || 0) + 1,
        });

        // Send congratulatory notification
        await notificationService.notifyCustomerReward({
          customerName: updatedCustomer.name,
          phone: updatedCustomer.phone,
          currentPoints: updatedCustomer.currentPoints || 0,
          message: `Congratulations ${updatedCustomer.name}! You've earned a FREE COFFEE at Coffee Pro!`
        });
      }

      res.json({
        message: earnedReward ? "Congratulations! You earned a free coffee!" : "Check-in successful!",
        customer: updatedCustomer,
        visit: visit,
        earnedReward,
        pointsToNextReward: earnedReward ? 5 : (5 - (updatedCustomer?.currentPoints || 0)),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin routes for loyalty program
  app.get("/api/admin/loyalty/customers", requireAdminAuth, async (req, res) => {
    try {
      const customers = await storage.getAllLoyaltyCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/loyalty/visits", requireAdminAuth, async (req, res) => {
    try {
      const visits = await storage.getAllLoyaltyVisits();
      res.json(visits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/loyalty/rewards", requireAdminAuth, async (req, res) => {
    try {
      const rewards = await storage.getAllLoyaltyRewards();
      res.json(rewards);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/notifications", requireAdminAuth, async (req, res) => {
    try {
      const notifications = notificationService.getNotificationHistory();
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/marketing/contacts/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMarketingContact(parseInt(id));
      res.json({ message: "Contact deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Franchise application routes
  app.post("/api/franchise/apply", async (req, res) => {
    try {
      const applicationData = insertFranchiseApplicationSchema.parse(req.body);
      const application = await storage.createFranchiseApplication(applicationData);
      res.json({ 
        message: "Franchise application submitted successfully!",
        application 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/admin/franchise/applications", requireAdminAuth, async (req, res) => {
    try {
      const applications = await storage.getAllFranchiseApplications();
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/franchise/applications/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // If rejecting, delete the application instead of updating status
      if (status === 'rejected') {
        await storage.deleteFranchiseApplication(parseInt(id));
        res.json({ message: "Application rejected and removed", deleted: true });
      } else {
        const application = await storage.updateFranchiseApplicationStatus(parseInt(id), status);
        if (!application) {
          return res.status(404).json({ message: "Application not found" });
        }
        res.json(application);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/franchise/applications/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteFranchiseApplication(parseInt(id));
      res.json({ message: "Application deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });



  app.post("/api/admin/loyalty/redeem", requireAdminAuth, async (req, res) => {
    try {
      const { customerId, notes } = req.body;
      
      if (!customerId) {
        return res.status(400).json({ message: "Customer ID is required" });
      }

      const customer = await storage.getLoyaltyCustomer(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      if ((customer.currentPoints || 0) < 5) {
        return res.status(400).json({ message: "Customer doesn't have enough points for a reward" });
      }

      // Create reward record
      await storage.createLoyaltyReward({
        customerId: customer.id,
        rewardType: "free_coffee",
        pointsUsed: 5,
        notes,
      });
      
      // Update customer points
      const updatedCustomer = await storage.updateLoyaltyCustomer(customer.id, {
        currentPoints: (customer.currentPoints || 0) - 5,
        totalRewards: (customer.totalRewards || 0) + 1,
      });

      res.json({
        message: "Reward redeemed successfully",
        customer: updatedCustomer,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // QR Token generation and validation endpoints
  app.post("/api/qr/generate", requireAdminAuth, async (req, res) => {
    try {
      // Clean up expired tokens first
      await storage.cleanupExpiredTokens();
      
      // Generate secure random token
      const tokenString = randomBytes(32).toString('hex');
      
      // Token never expires - set expiration far in the future (100 years)
      const expiresAt = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);
      
      const token = await storage.createQrToken({
        token: tokenString,
        expiresAt,
      });
      
      res.json({
        token: tokenString,
        expiresAt: expiresAt.toISOString(),
        validFor: null, // No expiration
        permanent: true
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/qr/validate", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      
      const qrToken = await storage.getQrToken(token);
      
      if (!qrToken) {
        return res.status(404).json({ message: "Invalid token" });
      }
      
      const now = new Date();
      const isPermanent = qrToken.expiresAt.getTime() > (Date.now() + 50 * 365 * 24 * 60 * 60 * 1000); // Check if expires more than 50 years from now
      
      // Only check expiration for non-permanent tokens
      if (!isPermanent && qrToken.expiresAt < now) {
        return res.status(400).json({ message: "Token has expired" });
      }
      
      // Don't mark permanent tokens as used so they can be reused
      // Only check if used for non-permanent tokens
      if (!isPermanent && qrToken.used) {
        return res.status(400).json({ message: "Token has already been used" });
      }
      
      // Mark non-permanent tokens as used
      if (!isPermanent) {
        await storage.markQrTokenAsUsed(token);
      }
      
      res.json({ 
        valid: true, 
        message: "Token validated successfully",
        permanent: isPermanent,
        remainingTime: isPermanent ? null : Math.max(0, Math.floor((qrToken.expiresAt.getTime() - now.getTime()) / 1000))
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
