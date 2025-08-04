import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'coffee', 'tea', 'food'
  description: text("description").notNull(),
  price: text("price").notNull(),
  image: text("image"),
  available: boolean("available").notNull().default(true),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  receiptNumber: text("receipt_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});



export const marketingContacts = pgTable("marketing_contacts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  name: text("name"),
  source: text("source").notNull(), // 'newsletter', 'community', 'loyalty', 'contact'
  preferences: text("preferences"), // JSON string for marketing preferences
  subscribed: boolean("subscribed").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  filename: text("filename").notNull().unique(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Loyalty program tables
export const loyaltyCustomers = pgTable("loyalty_customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  totalVisits: integer("total_visits").default(0),
  currentPoints: integer("current_points").default(0),
  totalRewards: integer("total_rewards").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const loyaltyVisits = pgTable("loyalty_visits", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => loyaltyCustomers.id),
  visitDate: timestamp("visit_date").defaultNow(),
  pointsEarned: integer("points_earned").default(1),
  notes: text("notes"),
});

export const loyaltyRewards = pgTable("loyalty_rewards", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => loyaltyCustomers.id),
  rewardType: varchar("reward_type", { length: 100 }).default("free_coffee"),
  pointsUsed: integer("points_used").default(5),
  redeemedAt: timestamp("redeemed_at").defaultNow(),
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  points: true,
  createdAt: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});



export const insertMarketingContactSchema = createInsertSchema(marketingContacts).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  name: z.string().optional(),
  source: z.enum(["newsletter", "community", "loyalty", "contact"]),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertLoyaltyCustomerSchema = createInsertSchema(loyaltyCustomers).omit({
  id: true,
  totalVisits: true,
  currentPoints: true,
  totalRewards: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLoyaltyVisitSchema = createInsertSchema(loyaltyVisits).omit({
  id: true,
}).extend({
  visitDate: z.date().optional(),
});

export const insertLoyaltyRewardSchema = createInsertSchema(loyaltyRewards).omit({
  id: true,
  redeemedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type MarketingContact = typeof marketingContacts.$inferSelect;
export type InsertMarketingContact = z.infer<typeof insertMarketingContactSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type LoyaltyCustomer = typeof loyaltyCustomers.$inferSelect;
export type InsertLoyaltyCustomer = z.infer<typeof insertLoyaltyCustomerSchema>;
export type LoyaltyVisit = typeof loyaltyVisits.$inferSelect;
export type InsertLoyaltyVisit = z.infer<typeof insertLoyaltyVisitSchema>;
export type LoyaltyReward = typeof loyaltyRewards.$inferSelect;
export type InsertLoyaltyReward = z.infer<typeof insertLoyaltyRewardSchema>;

// Franchise applications table
export const franchiseApplications = pgTable("franchise_applications", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  businessExperience: text("business_experience").notNull(),
  investmentCapacity: varchar("investment_capacity", { length: 50 }).notNull(),
  preferredLocation: varchar("preferred_location", { length: 255 }).notNull(),
  timelineToOpen: varchar("timeline_to_open", { length: 50 }).notNull(),
  additionalInfo: text("additional_info"),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFranchiseApplicationSchema = createInsertSchema(franchiseApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type FranchiseApplication = typeof franchiseApplications.$inferSelect;
export type InsertFranchiseApplication = z.infer<typeof insertFranchiseApplicationSchema>;

// QR Code tokens table for secure check-in access
export const qrTokens = pgTable("qr_tokens", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQrTokenSchema = createInsertSchema(qrTokens).omit({
  id: true,
  used: true,
  createdAt: true,
});

export type QrToken = typeof qrTokens.$inferSelect;
export type InsertQrToken = z.infer<typeof insertQrTokenSchema>;
