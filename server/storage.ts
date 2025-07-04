import { 
  users, 
  menuItems,
  contactMessages,
  chatMessages,
  marketingContacts,
  type User, 
  type InsertUser,
  type MenuItem,
  type InsertMenuItem,
  type ContactMessage,
  type InsertContactMessage,
  type ChatMessage,
  type InsertChatMessage,
  type MarketingContact,
  type InsertMarketingContact,
  type Video,
  type InsertVideo
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(id: number, points: number): Promise<User | undefined>;
  
  // Menu operations (removed - using PDF menu instead)
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(sessionId: string): Promise<ChatMessage[]>;
  
  // Marketing operations
  createMarketingContact(contact: InsertMarketingContact): Promise<MarketingContact>;
  getMarketingContactByEmail(email: string): Promise<MarketingContact | undefined>;
  updateMarketingContactSubscription(email: string, subscribed: boolean): Promise<MarketingContact | undefined>;
  getAllMarketingContacts(): Promise<MarketingContact[]>;

  // Video operations (removed - feature no longer needed)
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private menuItems: Map<number, MenuItem>;
  private contactMessages: Map<number, ContactMessage>;
  private chatMessages: Map<number, ChatMessage>;
  private marketingContacts: Map<number, MarketingContact>;
  private currentUserId: number;
  private currentMenuItemId: number;
  private currentContactMessageId: number;
  private currentChatMessageId: number;
  private currentMarketingContactId: number;

  constructor() {
    this.users = new Map();
    this.menuItems = new Map();
    this.contactMessages = new Map();
    this.chatMessages = new Map();
    this.marketingContacts = new Map();
    this.currentUserId = 1;
    this.currentMenuItemId = 1;
    this.currentContactMessageId = 1;
    this.currentChatMessageId = 1;
    this.currentMarketingContactId = 1;
    
    // Initialize with sample menu items
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    // Menu items removed - will be displayed via PDF upload
    this.currentMenuItemId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      points: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(id: number, points: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      user.points = points;
      this.users.set(id, user);
      return user;
    }
    return undefined;
  }

  // Menu methods removed - using PDF menu instead

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMarketingContact(insertContact: InsertMarketingContact): Promise<MarketingContact> {
    const id = this.currentMarketingContactId++;
    const contact: MarketingContact = { 
      ...insertContact,
      name: insertContact.name ?? null,
      phone: insertContact.phone ?? null,
      preferences: insertContact.preferences ?? null,
      id,
      subscribed: insertContact.subscribed ?? true,
      createdAt: new Date()
    };
    this.marketingContacts.set(id, contact);
    return contact;
  }

  async getMarketingContactByEmail(email: string): Promise<MarketingContact | undefined> {
    return Array.from(this.marketingContacts.values())
      .find(contact => contact.email === email);
  }

  async updateMarketingContactSubscription(email: string, subscribed: boolean): Promise<MarketingContact | undefined> {
    const contact = await this.getMarketingContactByEmail(email);
    if (contact) {
      contact.subscribed = subscribed;
      this.marketingContacts.set(contact.id, contact);
      return contact;
    }
    return undefined;
  }

  async getAllMarketingContacts(): Promise<MarketingContact[]> {
    return Array.from(this.marketingContacts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export class DatabaseStorage implements IStorage {
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

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(asc(chatMessages.createdAt));
  }

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
      .set({ subscribed: subscribed })
      .where(eq(marketingContacts.email, email))
      .returning();
    return contact || undefined;
  }

  async getAllMarketingContacts(): Promise<MarketingContact[]> {
    return await db
      .select()
      .from(marketingContacts)
      .orderBy(desc(marketingContacts.createdAt));
  }
}

export const storage = new DatabaseStorage();
