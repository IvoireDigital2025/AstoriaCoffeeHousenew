import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertContactMessageSchema,
  insertChatMessageSchema,
  insertMarketingContactSchema
} from "@shared/schema";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

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

  // Chat/AI routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      
      if (!message || !sessionId) {
        return res.status(400).json({ message: "Message and sessionId are required" });
      }

      // Get chat history for context
      const chatHistory = await storage.getChatHistory(sessionId);
      
      // Prepare context for OpenAI
      const systemPrompt = `You are a helpful AI assistant for Coffee Pro, a unique coffee corporation that blends Moroccan and Saudi Arabian coffee traditions with New York City energy.
      
      Key information about Coffee Pro:
      - Coffee Pro Corporation - over 32 years of experience rooted in Moroccan and Saudi Arabian coffee traditions
      - Corporate Headquarters: 23-33 Astoria Blvd, Astoria, NY 11102
      - Cultural Heritage: We honor the time-honored coffee rituals of the Arabian Peninsula and Morocco's Atlas Mountains
      - Authentic Experience: Traditional Arabic coffee preparations, Moroccan-inspired spice blends, and generous Middle Eastern hospitality
      - Mission: Bringing authentic flavors and hospitality traditions from Morocco and Saudi Arabia to New York City
      - Community: Creating gathering spaces that reflect the warmth and community spirit central to both cultures
      - Heritage Blends: Traditional Arabic coffee beans and Moroccan spice blends sourced from Yemen highlands and Atlas Mountains
      - Cultural Bridge: Connecting NYC's diverse communities through coffee, celebrating Middle Eastern heritage and American innovation
      - Sacred Ritual: Coffee as a ritual of welcome and community, honoring ancient hospitality traditions
      - Authentic Snacks: We offer premium Middle Eastern treats including Dubai chocolate, halva, Turkish delight, kunafa bites, nougat, premium nuts, za'atar crackers, and Arabian dates
      - Typical hours: Monday-Friday 6:00 AM - 8:00 PM, Saturday-Sunday 7:00 AM - 9:00 PM (varies by location)
      - Loyalty program available for customers to register and earn points
      - For specific inquiries, customers can contact us through our website contact form
      
      Be warm, welcoming, and embody the generous hospitality traditions of Morocco and Saudi Arabia. Share knowledge about our cultural heritage, traditional coffee preparations, and how we bridge ancient traditions with modern NYC life. Emphasize the cultural significance of coffee in our heritage and the authentic experience we provide.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...chatHistory.map(chat => [
          { role: "user", content: chat.message },
          { role: "assistant", content: chat.response }
        ]).flat(),
        { role: "user", content: message }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";

      // Store the chat message
      await storage.createChatMessage({
        sessionId,
        message,
        response: aiResponse
      });

      res.json({ response: aiResponse });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        message: "I'm experiencing technical difficulties. Please try again later or contact us directly.",
        error: error.message 
      });
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

  // Video API endpoints (simplified for now)
  app.get("/api/videos", (req, res) => {
    // Sample video representing your Moroccan sweets video
    const sampleVideos = [
      {
        id: 1,
        title: "Honey Moroccan Sweets - Coffee Pro Style",
        description: "Honey, you deserve this 🍯 Moroccan sweets done the Pro way—drizzled, dreamy, and unforgettable. Experience authentic Middle Eastern flavors at Coffee Pro Astoria.",
        filename: "moroccan-sweets-honey.mp4",
        originalName: "Honey Moroccan Sweets Video.mp4",
        mimeType: "video/mp4",
        size: 25600000, // ~25MB
        createdAt: new Date().toISOString(),
      }
    ];
    res.json(sampleVideos);
  });

  app.post("/api/videos/upload", requireAdminAuth, (req, res) => {
    // Placeholder for video upload - will be implemented with proper file handling
    res.status(501).json({ message: "Video upload feature coming soon" });
  });

  app.get("/api/videos/:id/stream", (req, res) => {
    const { id } = req.params;
    if (id === "1") {
      // Redirect to the direct static asset URL
      const videoUrl = `/attached_assets/Honey, you deserve this 🍯 Moroccan sweets done the Pro way—drizzled, dreamy, and unforgettable.#CoffeeProAstoria #AstoriaEats #MoroccanSweets #NYCFoodie #HoneyDrizzle #TreatYourself #CoffeeTime #SweetEscape_1751613021125.mp4`;
      res.redirect(videoUrl);
    } else {
      res.status(404).json({ message: "Video not found" });
    }
  });

  app.get("/api/videos/:id/thumbnail", (req, res) => {
    // Generate a thumbnail from the video or use a placeholder
    res.status(404).json({ message: "Thumbnail generation not implemented" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
