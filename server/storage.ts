import { 
  users, 
  menuItems,
  contactMessages,
  marketingContacts,
  videos,
  loyaltyCustomers,
  loyaltyVisits,
  loyaltyRewards,
  pendingCheckins,
  franchiseApplications,
  type User, 
  type InsertUser,
  type MenuItem,
  type InsertMenuItem,
  type ContactMessage,
  type InsertContactMessage,
  type MarketingContact,
  type InsertMarketingContact,
  type Video,
  type InsertVideo,
  type LoyaltyCustomer,
  type InsertLoyaltyCustomer,
  type LoyaltyVisit,
  type InsertLoyaltyVisit,
  type LoyaltyReward,
  type InsertLoyaltyReward,
  type PendingCheckin,
  type InsertPendingCheckin,
  type FranchiseApplication,
  type InsertFranchiseApplication
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, desc } from "drizzle-orm";

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
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  deleteContactMessage(id: number): Promise<void>;
  

  
  // Marketing operations
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

  // Pending check-in operations
  createPendingCheckin(checkin: InsertPendingCheckin): Promise<PendingCheckin>;
  getAllPendingCheckins(): Promise<PendingCheckin[]>;
  updatePendingCheckinStatus(id: number, status: string, staffNotes?: string, approvedBy?: string): Promise<PendingCheckin | undefined>;
  deletePendingCheckin(id: number): Promise<void>;

  // Franchise application operations
  createFranchiseApplication(application: InsertFranchiseApplication): Promise<FranchiseApplication>;
  getAllFranchiseApplications(): Promise<FranchiseApplication[]>;
  updateFranchiseApplicationStatus(id: number, status: string): Promise<FranchiseApplication | undefined>;
  deleteFranchiseApplication(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private menuItems: Map<number, MenuItem>;
  private contactMessages: Map<number, ContactMessage>;

  private marketingContacts: Map<number, MarketingContact>;
  private videos: Map<number, Video>;
  private loyaltyCustomers: Map<number, LoyaltyCustomer>;
  private loyaltyVisits: Map<number, LoyaltyVisit>;
  private loyaltyRewards: Map<number, LoyaltyReward>;
  private pendingCheckins: Map<number, PendingCheckin>;
  private franchiseApplications: Map<number, FranchiseApplication>;
  private currentUserId: number;
  private currentMenuItemId: number;
  private currentContactMessageId: number;

  private currentMarketingContactId: number;
  private currentVideoId: number;
  private currentLoyaltyCustomerId: number;
  private currentLoyaltyVisitId: number;
  private currentLoyaltyRewardId: number;
  private currentPendingCheckinId: number;
  private currentFranchiseApplicationId: number;

  constructor() {
    this.users = new Map();
    this.menuItems = new Map();
    this.contactMessages = new Map();
    this.marketingContacts = new Map();
    this.videos = new Map();
    this.loyaltyCustomers = new Map();
    this.loyaltyVisits = new Map();
    this.loyaltyRewards = new Map();
    this.pendingCheckins = new Map();
    this.franchiseApplications = new Map();
    this.currentUserId = 1;
    this.currentMenuItemId = 1;
    this.currentContactMessageId = 1;
    this.currentMarketingContactId = 1;
    this.currentVideoId = 1;
    this.currentLoyaltyCustomerId = 1;
    this.currentLoyaltyVisitId = 1;
    this.currentLoyaltyRewardId = 1;
    this.currentPendingCheckinId = 1;
    this.currentFranchiseApplicationId = 1;
    
    // Initialize with sample menu items
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    // Authentic Coffee Pro menu items with your provided images
    const menuItems = [
      // Pastries
      {
        name: "Dubai Pistachio Cheese Bomb",
        description: "Authentic Dubai-style pastry filled with rich pistachio cream and creamy cheese",
        price: "",
        category: "pastries",
        image: "",
        available: true
      },
      {
        name: "Egyptian Almond Croissant",
        description: "Buttery croissant filled with traditional Egyptian almond paste",
        price: "",
        category: "pastries",
        image: "",
        available: true
      },
      {
        name: "Egyptian Date Ma'amoul",
        description: "Traditional filled cookies with premium Medjool dates",
        price: "",
        category: "pastries",
        image: "",
        available: true
      },
      {
        name: "Arabian Honey Baklava",
        description: "Layers of phyllo pastry with nuts and authentic Middle Eastern honey",
        price: "",
        category: "pastries",
        image: "",
        available: true
      },
      {
        name: "Lebanese Knafeh Slice",
        description: "Traditional cheese pastry with crispy kadaif and orange blossom syrup",
        price: "",
        category: "pastries",
        image: "",
        available: true
      },
      {
        name: "Turkish Delight Muffin",
        description: "Soft muffin infused with rose water and Turkish delight pieces",
        price: "",
        category: "pastries",
        image: "",
        available: true
      },
      
      // Coffee & Beverages
      {
        name: "Arabic Coffee (Qahwa)",
        description: "Traditional Egyptian coffee with cardamom and saffron",
        price: "",
        category: "coffee",
        image: "/attached_assets/arabiccoffee_1024x1024@2x_1749453882291.webp",
        available: true
      },
      {
        name: "Egyptian Mint Tea",
        description: "Traditional Atay with fresh mint leaves and sugar",
        price: "",
        category: "coffee",
        image: "/attached_assets/3173d643-68f8-428a-8cf6-ba9eb2098628-retina-large_1749665320869.webp",
        available: true
      },
      {
        name: "Turkish Coffee",
        description: "Finely ground coffee beans prepared in traditional Turkish style",
        price: "",
        category: "coffee",
        image: "/attached_assets/55896839-1d86-4ab0-987e-03085b591be0-retina-large_1749665465918.webp",
        available: true
      },
      {
        name: "Cardamom Latte",
        description: "Espresso with steamed milk and aromatic cardamom spice",
        price: "",
        category: "coffee",
        image: "/attached_assets/d03601e7-1d58-4fab-a9f8-b9053c3e2530-retina-large_1749665500203.avif",
        available: true
      },
      {
        name: "Rose Water Cappuccino",
        description: "Classic cappuccino enhanced with delicate rose water",
        price: "",
        category: "coffee",
        image: "/attached_assets/254fed10-e992-46b5-b626-e407e069fd21-retina-large_1749665560880.avif",
        available: true
      },
      {
        name: "Saffron Cold Brew",
        description: "Cold brew coffee infused with precious saffron threads",
        price: "",
        category: "coffee",
        image: "/attached_assets/82aab21c-4d05-4855-ac3c-7f0774b45d92-retina-large_1749665749407.avif",
        available: true
      },
      {
        name: "Pistachio Iced Latte",
        description: "Iced latte with authentic Middle Eastern pistachio syrup",
        price: "",
        category: "coffee",
        image: "/attached_assets/0fef52d0-27f5-4802-807b-d706022974f5-retina-large_1749665863728.avif",
        available: true
      },
      {
        name: "Date Syrup Macchiato",
        description: "Espresso macchiato sweetened with natural date syrup",
        price: "",
        category: "coffee",
        image: "/attached_assets/4ee5ac97-394f-47b3-87b3-72ca0da58a23-retina-large_1749665903021.webp",
        available: true
      },
      {
        name: "Orange Blossom Americano",
        description: "Classic Americano with a hint of orange blossom water",
        price: "",
        category: "coffee",
        image: "/attached_assets/db65d635-7a2f-42df-84be-e9b1a3181eb8-retina-large_1749665943655.webp",
        available: true
      }
    ];

    menuItems.forEach(item => {
      const menuItem: MenuItem = {
        id: this.currentMenuItemId++,
        ...item
      };
      this.menuItems.set(menuItem.id, menuItem);
    });
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

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.available);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      item => item.category === category && item.available
    );
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const item: MenuItem = { 
      ...insertItem, 
      id,
      image: insertItem.image || null,
      available: insertItem.available ?? true
    };
    this.menuItems.set(id, item);
    return item;
  }

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

  async deleteContactMessage(id: number): Promise<void> {
    this.contactMessages.delete(id);
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

  async deleteMarketingContact(id: number): Promise<void> {
    this.marketingContacts.delete(id);
  }

  // Video operations
  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const video: Video = { 
      ...insertVideo, 
      id,
      description: insertVideo.description || null,
      createdAt: new Date()
    };
    this.videos.set(id, video);
    return video;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getAllVideos(): Promise<Video[]> {
    return Array.from(this.videos.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async deleteVideo(id: number): Promise<void> {
    this.videos.delete(id);
  }

  // Loyalty program methods
  async getLoyaltyCustomer(id: number): Promise<LoyaltyCustomer | undefined> {
    return this.loyaltyCustomers.get(id);
  }

  async getLoyaltyCustomerByPhone(phone: string): Promise<LoyaltyCustomer | undefined> {
    return Array.from(this.loyaltyCustomers.values()).find(customer => customer.phone === phone);
  }

  async getLoyaltyCustomerByEmail(email: string): Promise<LoyaltyCustomer | undefined> {
    return Array.from(this.loyaltyCustomers.values()).find(customer => customer.email === email);
  }

  async createLoyaltyCustomer(insertCustomer: InsertLoyaltyCustomer): Promise<LoyaltyCustomer> {
    const id = this.currentLoyaltyCustomerId++;
    const customer: LoyaltyCustomer = {
      id,
      ...insertCustomer,
      totalVisits: 0,
      currentPoints: 0,
      totalRewards: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.loyaltyCustomers.set(id, customer);
    return customer;
  }

  async updateLoyaltyCustomer(id: number, updates: Partial<LoyaltyCustomer>): Promise<LoyaltyCustomer | undefined> {
    const customer = this.loyaltyCustomers.get(id);
    if (!customer) return undefined;
    
    const updatedCustomer = { ...customer, ...updates, updatedAt: new Date() };
    this.loyaltyCustomers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async getAllLoyaltyCustomers(): Promise<LoyaltyCustomer[]> {
    return Array.from(this.loyaltyCustomers.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createLoyaltyVisit(insertVisit: InsertLoyaltyVisit): Promise<LoyaltyVisit> {
    const id = this.currentLoyaltyVisitId++;
    const visit: LoyaltyVisit = {
      id,
      ...insertVisit,
      visitDate: new Date(),
      pointsEarned: insertVisit.pointsEarned || 1,
    };
    this.loyaltyVisits.set(id, visit);
    return visit;
  }

  async getLoyaltyVisitsByCustomer(customerId: number): Promise<LoyaltyVisit[]> {
    return Array.from(this.loyaltyVisits.values())
      .filter(visit => visit.customerId === customerId)
      .sort((a, b) => b.visitDate!.getTime() - a.visitDate!.getTime());
  }

  async getAllLoyaltyVisits(): Promise<LoyaltyVisit[]> {
    return Array.from(this.loyaltyVisits.values()).sort((a, b) => 
      b.visitDate!.getTime() - a.visitDate!.getTime()
    );
  }

  async createLoyaltyReward(insertReward: InsertLoyaltyReward): Promise<LoyaltyReward> {
    const id = this.currentLoyaltyRewardId++;
    const reward: LoyaltyReward = {
      id,
      ...insertReward,
      redeemedAt: new Date(),
    };
    this.loyaltyRewards.set(id, reward);
    return reward;
  }

  async getLoyaltyRewardsByCustomer(customerId: number): Promise<LoyaltyReward[]> {
    return Array.from(this.loyaltyRewards.values())
      .filter(reward => reward.customerId === customerId)
      .sort((a, b) => b.redeemedAt!.getTime() - a.redeemedAt!.getTime());
  }

  async getAllLoyaltyRewards(): Promise<LoyaltyReward[]> {
    return Array.from(this.loyaltyRewards.values()).sort((a, b) => 
      b.redeemedAt!.getTime() - a.redeemedAt!.getTime()
    );
  }

  // Franchise application methods
  async createFranchiseApplication(insertApplication: InsertFranchiseApplication): Promise<FranchiseApplication> {
    const id = this.currentFranchiseApplicationId++;
    const application: FranchiseApplication = {
      id,
      ...insertApplication,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.franchiseApplications.set(id, application);
    return application;
  }

  async getAllFranchiseApplications(): Promise<FranchiseApplication[]> {
    return Array.from(this.franchiseApplications.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateFranchiseApplicationStatus(id: number, status: string): Promise<FranchiseApplication | undefined> {
    const application = this.franchiseApplications.get(id);
    if (!application) return undefined;
    
    const updatedApplication = { ...application, status, updatedAt: new Date() };
    this.franchiseApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  async deleteFranchiseApplication(id: number): Promise<void> {
    this.franchiseApplications.delete(id);
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

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
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
    return await db
      .select()
      .from(videos)
      .orderBy(desc(videos.createdAt));
  }

  async deleteVideo(id: number): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  // Loyalty program methods
  async getLoyaltyCustomer(id: number): Promise<LoyaltyCustomer | undefined> {
    const [customer] = await db.select().from(loyaltyCustomers).where(eq(loyaltyCustomers.id, id));
    return customer;
  }

  async getLoyaltyCustomerByPhone(phone: string): Promise<LoyaltyCustomer | undefined> {
    const [customer] = await db.select().from(loyaltyCustomers).where(eq(loyaltyCustomers.phone, phone));
    return customer;
  }

  async getLoyaltyCustomerByEmail(email: string): Promise<LoyaltyCustomer | undefined> {
    const [customer] = await db.select().from(loyaltyCustomers).where(eq(loyaltyCustomers.email, email));
    return customer;
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
    return customer;
  }

  async getAllLoyaltyCustomers(): Promise<LoyaltyCustomer[]> {
    return await db
      .select()
      .from(loyaltyCustomers)
      .orderBy(desc(loyaltyCustomers.createdAt));
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
    return await db
      .select()
      .from(loyaltyVisits)
      .orderBy(desc(loyaltyVisits.visitDate));
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
    return await db
      .select()
      .from(loyaltyRewards)
      .orderBy(desc(loyaltyRewards.redeemedAt));
  }

  // Pending check-in methods
  async createPendingCheckin(insertCheckin: InsertPendingCheckin): Promise<PendingCheckin> {
    const [checkin] = await db
      .insert(pendingCheckins)
      .values(insertCheckin)
      .returning();
    return checkin;
  }

  async getAllPendingCheckins(): Promise<PendingCheckin[]> {
    return await db
      .select()
      .from(pendingCheckins)
      .orderBy(desc(pendingCheckins.createdAt));
  }

  async updatePendingCheckinStatus(id: number, status: string, staffNotes?: string, approvedBy?: string): Promise<PendingCheckin | undefined> {
    const updateData: any = { status };
    if (staffNotes) updateData.staffNotes = staffNotes;
    if (approvedBy) updateData.approvedBy = approvedBy;
    if (status === 'approved') updateData.approvedAt = new Date();

    const [checkin] = await db
      .update(pendingCheckins)
      .set(updateData)
      .where(eq(pendingCheckins.id, id))
      .returning();
    return checkin || undefined;
  }

  async deletePendingCheckin(id: number): Promise<void> {
    await db.delete(pendingCheckins).where(eq(pendingCheckins.id, id));
  }

  // Franchise application methods
  async createFranchiseApplication(insertApplication: InsertFranchiseApplication): Promise<FranchiseApplication> {
    const [application] = await db
      .insert(franchiseApplications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getAllFranchiseApplications(): Promise<FranchiseApplication[]> {
    return await db
      .select()
      .from(franchiseApplications)
      .orderBy(desc(franchiseApplications.createdAt));
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
}

export const storage = new DatabaseStorage();
