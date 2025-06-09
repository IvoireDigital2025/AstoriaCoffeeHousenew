import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertContactMessageSchema,
  insertChatMessageSchema 
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

  const httpServer = createServer(app);
  return httpServer;
}
