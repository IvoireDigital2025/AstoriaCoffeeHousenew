import { eq, lt, desc } from "drizzle-orm";
import { db } from "./db";
import { 
  users, menuItems, contactMessages, marketingContacts, videos,
  loyaltyCustomers, loyaltyVisits, loyaltyRewards, 
  franchiseApplications, qrTokens 
} from "@shared/schema";
import type { 
  User, InsertUser, 
  MenuItem, InsertMenuItem,
  ContactMessage, InsertContactMessage,
  MarketingContact, InsertMarketingContact,
  Video, InsertVideo,
  LoyaltyCustomer, InsertLoyaltyCustomer,
  LoyaltyVisit, InsertLoyaltyVisit,
  LoyaltyReward, InsertLoyaltyReward,
  FranchiseApplication, InsertFranchiseApplication,
  QrToken, InsertQrToken
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(id: number, points: number): Promise<User | undefined>;
  
  // Menu operations
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<void>;
  
  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  deleteContactMessage(id: number): Promise<void>;

  // Marketing contact operations
  createMarketingContact(contact: InsertMarketingContact): Promise<MarketingContact>;
  getMarketingContactByEmail(email: string): Promise<MarketingContact | undefined>;
  updateMarketingContactSubscription(email: string, subscribed: boolean): Promise<MarketingContact | undefined>;
  getAllMarketingContacts(): Promise<MarketingContact[]>;
  deleteMarketingContact(id: number): Promise<void>;

  // Video operations
  createVideo(video: InsertVideo): Promise<Video>;
  getVideo(id: number): Promise<Video | undefined>;
  getAllVideos(): Promise<Video[]>;
  deleteVideo(id: number): Promise<void>;

  // Loyalty program operations
  getLoyaltyCustomer(id: number): Promise<LoyaltyCustomer | undefined>;
  getLoyaltyCustomerByPhone(phone: string): Promise<LoyaltyCustomer | undefined>;
  getLoyaltyCustomerByEmail(email: string): Promise<LoyaltyCustomer | undefined>;
  createLoyaltyCustomer(customer: InsertLoyaltyCustomer): Promise<LoyaltyCustomer>;
  updateLoyaltyCustomer(id: number, updates: Partial<LoyaltyCustomer>): Promise<LoyaltyCustomer | undefined>;
  getAllLoyaltyCustomers(): Promise<LoyaltyCustomer[]>;
  
  createLoyaltyVisit(visit: InsertLoyaltyVisit): Promise<LoyaltyVisit>;
  getLoyaltyVisitsByCustomer(customerId: number): Promise<LoyaltyVisit[]>;
  getAllLoyaltyVisits(): Promise<LoyaltyVisit[]>;
  
  createLoyaltyReward(reward: InsertLoyaltyReward): Promise<LoyaltyReward>;
  getLoyaltyRewardsByCustomer(customerId: number): Promise<LoyaltyReward[]>;
  getAllLoyaltyRewards(): Promise<LoyaltyReward[]>;

  // Franchise application operations
  createFranchiseApplication(application: InsertFranchiseApplication): Promise<FranchiseApplication>;
  getAllFranchiseApplications(): Promise<FranchiseApplication[]>;
  updateFranchiseApplicationStatus(id: number, status: string): Promise<FranchiseApplication | undefined>;
  deleteFranchiseApplication(id: number): Promise<void>;

  // QR Token operations
  createQrToken(token: InsertQrToken): Promise<QrToken>;
  getQrToken(token: string): Promise<QrToken | undefined>;
  markQrTokenAsUsed(token: string): Promise<void>;
  cleanupExpiredTokens(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserPoints(id: number, points: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ points: points })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Menu operations
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.category, category));
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const [item] = await db
      .insert(menuItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const [item] = await db
      .update(menuItems)
      .set(updates)
      .where(eq(menuItems.id, id))
      .returning();
    return item || undefined;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  // Contact message operations
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  // Marketing contact operations
  async createMarketingContact(insertContact: InsertMarketingContact): Promise<MarketingContact> {
    const [contact] = await db
      .insert(marketingContacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getMarketingContactByEmail(email: string): Promise<MarketingContact | undefined> {
    const [contact] = await db
      .select()
      .from(marketingContacts)
      .where(eq(marketingContacts.email, email));
    return contact || undefined;
  }

  async updateMarketingContactSubscription(email: string, subscribed: boolean): Promise<MarketingContact | undefined> {
    const [contact] = await db
      .update(marketingContacts)
      .set({ subscribed })
      .where(eq(marketingContacts.email, email))
      .returning();
    return contact || undefined;
  }

  async getAllMarketingContacts(): Promise<MarketingContact[]> {
    return await db.select().from(marketingContacts).orderBy(desc(marketingContacts.createdAt));
  }

  async deleteMarketingContact(id: number): Promise<void> {
    await db.delete(marketingContacts).where(eq(marketingContacts.id, id));
  }

  // Video operations
  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db
      .insert(videos)
      .values(insertVideo)
      .returning();
    return video;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async getAllVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async deleteVideo(id: number): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  // Loyalty program operations
  async getLoyaltyCustomer(id: number): Promise<LoyaltyCustomer | undefined> {
    const [customer] = await db
      .select()
      .from(loyaltyCustomers)
      .where(eq(loyaltyCustomers.id, id));
    return customer || undefined;
  }

  async getLoyaltyCustomerByPhone(phone: string): Promise<LoyaltyCustomer | undefined> {
    const [customer] = await db
      .select()
      .from(loyaltyCustomers)
      .where(eq(loyaltyCustomers.phone, phone));
    return customer || undefined;
  }

  async getLoyaltyCustomerByEmail(email: string): Promise<LoyaltyCustomer | undefined> {
    const [customer] = await db
      .select()
      .from(loyaltyCustomers)
      .where(eq(loyaltyCustomers.email, email));
    return customer || undefined;
  }

  async createLoyaltyCustomer(insertCustomer: InsertLoyaltyCustomer): Promise<LoyaltyCustomer> {
    const [customer] = await db
      .insert(loyaltyCustomers)
      .values(insertCustomer)
      .returning();
    return customer;
  }

  async updateLoyaltyCustomer(id: number, updates: Partial<LoyaltyCustomer>): Promise<LoyaltyCustomer | undefined> {
    const [customer] = await db
      .update(loyaltyCustomers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(loyaltyCustomers.id, id))
      .returning();
    return customer || undefined;
  }

  async getAllLoyaltyCustomers(): Promise<LoyaltyCustomer[]> {
    return await db.select().from(loyaltyCustomers).orderBy(desc(loyaltyCustomers.createdAt));
  }

  async createLoyaltyVisit(insertVisit: InsertLoyaltyVisit): Promise<LoyaltyVisit> {
    const [visit] = await db
      .insert(loyaltyVisits)
      .values(insertVisit)
      .returning();
    return visit;
  }

  async getLoyaltyVisitsByCustomer(customerId: number): Promise<LoyaltyVisit[]> {
    return await db
      .select()
      .from(loyaltyVisits)
      .where(eq(loyaltyVisits.customerId, customerId))
      .orderBy(desc(loyaltyVisits.visitDate));
  }

  async getAllLoyaltyVisits(): Promise<LoyaltyVisit[]> {
    return await db.select().from(loyaltyVisits).orderBy(desc(loyaltyVisits.visitDate));
  }

  async createLoyaltyReward(insertReward: InsertLoyaltyReward): Promise<LoyaltyReward> {
    const [reward] = await db
      .insert(loyaltyRewards)
      .values(insertReward)
      .returning();
    return reward;
  }

  async getLoyaltyRewardsByCustomer(customerId: number): Promise<LoyaltyReward[]> {
    return await db
      .select()
      .from(loyaltyRewards)
      .where(eq(loyaltyRewards.customerId, customerId))
      .orderBy(desc(loyaltyRewards.redeemedAt));
  }

  async getAllLoyaltyRewards(): Promise<LoyaltyReward[]> {
    return await db.select().from(loyaltyRewards).orderBy(desc(loyaltyRewards.redeemedAt));
  }

  // Franchise application operations
  async createFranchiseApplication(insertApplication: InsertFranchiseApplication): Promise<FranchiseApplication> {
    const [application] = await db
      .insert(franchiseApplications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getAllFranchiseApplications(): Promise<FranchiseApplication[]> {
    return await db.select().from(franchiseApplications).orderBy(desc(franchiseApplications.createdAt));
  }

  async updateFranchiseApplicationStatus(id: number, status: string): Promise<FranchiseApplication | undefined> {
    const [application] = await db
      .update(franchiseApplications)
      .set({ status, updatedAt: new Date() })
      .where(eq(franchiseApplications.id, id))
      .returning();
    return application || undefined;
  }

  async deleteFranchiseApplication(id: number): Promise<void> {
    await db.delete(franchiseApplications).where(eq(franchiseApplications.id, id));
  }

  // QR Token operations
  async createQrToken(insertToken: InsertQrToken): Promise<QrToken> {
    const [token] = await db
      .insert(qrTokens)
      .values(insertToken)
      .returning();
    return token;
  }

  async getQrToken(tokenString: string): Promise<QrToken | undefined> {
    const [token] = await db
      .select()
      .from(qrTokens)
      .where(eq(qrTokens.token, tokenString));
    return token || undefined;
  }

  async markQrTokenAsUsed(tokenString: string): Promise<void> {
    await db
      .update(qrTokens)
      .set({ used: true })
      .where(eq(qrTokens.token, tokenString));
  }

  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    await db
      .delete(qrTokens)
      .where(lt(qrTokens.expiresAt, now));
  }
}

export const storage = new DatabaseStorage();