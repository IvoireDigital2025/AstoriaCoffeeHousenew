import { 
  users, 
  menuItems,
  contactMessages,
  marketingContacts,
  videos,
  type User, 
  type InsertUser,
  type MenuItem,
  type InsertMenuItem,
  type ContactMessage,
  type InsertContactMessage,
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
  
  // Menu operations
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  

  
  // Marketing operations
  createMarketingContact(contact: InsertMarketingContact): Promise<MarketingContact>;
  getMarketingContactByEmail(email: string): Promise<MarketingContact | undefined>;
  updateMarketingContactSubscription(email: string, subscribed: boolean): Promise<MarketingContact | undefined>;
  getAllMarketingContacts(): Promise<MarketingContact[]>;

  // Video operations
  createVideo(video: InsertVideo): Promise<Video>;
  getVideo(id: number): Promise<Video | undefined>;
  getAllVideos(): Promise<Video[]>;
  deleteVideo(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private menuItems: Map<number, MenuItem>;
  private contactMessages: Map<number, ContactMessage>;

  private marketingContacts: Map<number, MarketingContact>;
  private videos: Map<number, Video>;
  private currentUserId: number;
  private currentMenuItemId: number;
  private currentContactMessageId: number;

  private currentMarketingContactId: number;
  private currentVideoId: number;

  constructor() {
    this.users = new Map();
    this.menuItems = new Map();
    this.contactMessages = new Map();
    this.marketingContacts = new Map();
    this.videos = new Map();
    this.currentUserId = 1;
    this.currentMenuItemId = 1;
    this.currentContactMessageId = 1;
    this.currentMarketingContactId = 1;
    this.currentVideoId = 1;
    
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
        name: "Saudi Date Ma'amoul",
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
      
      // Hot Drinks Menu from Coffee Pro
      {
        name: "Hot Coffee",
        description: "Classic hot brewed coffee",
        price: "$4.00",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Espresso",
        description: "Rich and concentrated coffee shot",
        price: "$3.00",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Flat White",
        description: "Espresso with steamed milk and microfoam",
        price: "$4.50",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Gold Capuccino",
        description: "Premium cappuccino with golden foam art",
        price: "$19.00",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Capuccino",
        description: "Classic cappuccino with steamed milk foam",
        price: "$5.50",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Latte",
        description: "Espresso with steamed milk and light foam",
        price: "$6.00",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Moccha",
        description: "Espresso with chocolate and steamed milk",
        price: "$7.99",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Matcha",
        description: "Japanese green tea matcha latte",
        price: "$5.50",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot V60",
        description: "Pour-over coffee with V60 brewing method",
        price: "$7.00",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Cortado",
        description: "Equal parts espresso and warm milk",
        price: "$5.00",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Chai Latte",
        description: "Spiced tea latte with steamed milk",
        price: "$5.00",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Dirty Chai Latte",
        description: "Chai latte with espresso shot",
        price: "$6.00",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Tea",
        description: "Traditional hot tea",
        price: "$3.75",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Red Eye",
        description: "Coffee with espresso shot",
        price: "$5.50",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Chocolate",
        description: "Rich and creamy hot chocolate",
        price: "$5.50",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Americano",
        description: "Espresso with hot water",
        price: "$4.50",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Doppio Espresso - Italian",
        description: "Double shot of Italian espresso",
        price: "$4.67",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "French Toast Pro Latte",
        description: "Specialty latte with French toast flavors",
        price: "$7.00",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "London Fog",
        description: "Earl Grey tea with steamed milk and vanilla",
        price: "$4.50",
        category: "hot-drinks",
        image: "",
        available: true
      },
      {
        name: "Hot Macchiato",
        description: "Espresso with a dollop of foamed milk",
        price: "$5.00",
        category: "hot-drinks",
        image: "",
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
}

export const storage = new DatabaseStorage();
