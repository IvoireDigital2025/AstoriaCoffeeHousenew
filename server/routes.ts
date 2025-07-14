import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { notificationService } from "./notifications";
import { 
  insertUserSchema, 
  insertContactMessageSchema,
  insertMarketingContactSchema,
  insertLoyaltyCustomerSchema,
  insertLoyaltyVisitSchema,
  insertLoyaltyRewardSchema,
  insertPendingCheckinSchema,
  insertFranchiseApplicationSchema
} from "@shared/schema";

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
      const contactData = insertMarketingContactSchema.parse({
        ...req.body,
        source: "newsletter"
      });
      
      // Check if email already exists
      const existingContact = await storage.getMarketingContactByEmail(contactData.email);
      if (existingContact) {
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
      
      const contact = await storage.createMarketingContact(contactData);
      res.json({ 
        message: "Successfully subscribed to our newsletter!",
        contact: contact
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
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
      
      if (password === adminPassword) {
        if (!req.session) {
          return res.status(500).json({ message: "Session not available" });
        }
        req.session.adminAuthenticated = true;
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Server error during login" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", (req: any, res) => {
    req.session.adminAuthenticated = false;
    res.json({ message: "Logged out successfully" });
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

  // Protected admin route to get all contact messages
  app.get("/api/contact/messages", requireAdminAuth, async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
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
        email,
        currentPoints: 0,
        totalVisits: 0,
        totalRewards: 0,
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
      const { name, phone, email, latitude, longitude } = req.body;
      
      if (!name || !phone || !email) {
        return res.status(400).json({ message: "Name, phone, and email are required" });
      }

      // Location validation
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Location data is required for check-in" });
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

      // Check if customer exists by phone (primary identifier)
      let customer = await storage.getLoyaltyCustomerByPhone(phone);
      
      if (!customer) {
        // Create new customer
        customer = await storage.createLoyaltyCustomer({ name, phone, email });
      }

      // Create visit record
      const visit = await storage.createLoyaltyVisit({
        customerId: customer.id,
        pointsEarned: 1,
      });

      // Update customer points and visit count
      const updatedCustomer = await storage.updateLoyaltyCustomer(customer.id, {
        totalVisits: (customer.totalVisits || 0) + 1,
        currentPoints: (customer.currentPoints || 0) + 1,
      });

      // Check if customer earned a free coffee (5 points)
      const earnedReward = updatedCustomer && updatedCustomer.currentPoints >= 5;
      
      if (earnedReward) {
        // Create reward record
        await storage.createLoyaltyReward({
          customerId: customer.id,
          rewardType: "free_coffee",
          pointsUsed: 5,
        });
        
        // Reset current points
        await storage.updateLoyaltyCustomer(customer.id, {
          currentPoints: updatedCustomer.currentPoints - 5,
          totalRewards: (updatedCustomer.totalRewards || 0) + 1,
        });

        // Send congratulatory notification
        await notificationService.notifyCustomerReward({
          customerName: updatedCustomer.name,
          phone: updatedCustomer.phone,
          currentPoints: updatedCustomer.currentPoints,
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
      const application = await storage.updateFranchiseApplicationStatus(parseInt(id), status);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
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
        currentPoints: customer.currentPoints - 5,
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

  const httpServer = createServer(app);
  return httpServer;
}
