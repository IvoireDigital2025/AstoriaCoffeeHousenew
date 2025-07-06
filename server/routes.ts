import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertContactMessageSchema,
  insertMarketingContactSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
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

  // Admin authentication middleware
  const requireAdminAuth = (req: any, res: any, next: any) => {
    const isAuthenticated = req.session?.adminAuthenticated;
    if (!isAuthenticated) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    next();
  };

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



  const httpServer = createServer(app);
  return httpServer;
}
