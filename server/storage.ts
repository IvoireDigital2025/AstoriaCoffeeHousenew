import { db } from "./db";
import { users, menuItems, contactMessages, chatMessages } from "@shared/schema";
import type { User, InsertUser, MenuItem, InsertMenuItem, ContactMessage, InsertContactMessage, ChatMessage, InsertChatMessage } from "@shared/schema";
import { eq } from "drizzle-orm";

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
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(sessionId: string): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private menuItems: Map<number, MenuItem>;
  private contactMessages: Map<number, ContactMessage>;
  private chatMessages: Map<number, ChatMessage>;
  private currentUserId: number;
  private currentMenuItemId: number;
  private currentContactMessageId: number;
  private currentChatMessageId: number;

  constructor() {
    this.users = new Map();
    this.menuItems = new Map();
    this.contactMessages = new Map();
    this.chatMessages = new Map();
    this.currentUserId = 1;
    this.currentMenuItemId = 1;
    this.currentContactMessageId = 1;
    this.currentChatMessageId = 1;
    
    // Initialize with sample menu items
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    const menuData: Omit<MenuItem, 'id'>[] = [
      // Menu Pastry (from your DoorDash screenshots)
      {
        name: "Croissant",
        category: "food",
        description: "Buttery, flaky layers of pastry baked to golden perfection, crispy on the outside and tender on the inside.",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Pain au Chocolat",
        category: "food",
        description: "A classic French pastry featuring buttery, flaky croissant dough wrapped around rich, dark chocolate.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587", 
        available: true
      },
      {
        name: "Almond Croissant",
        category: "food",
        description: "Delicate croissant filled with sweet almond cream and topped with sliced almonds.",
        price: "$4.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Danish",
        category: "food",
        description: "Flaky pastry with sweet filling, available in various flavors including cheese and fruit.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },

      // Gourmet Muffins (from your DoorDash screenshots)
      {
        name: "Blueberry Muffin",
        category: "food",
        description: "Bursting with fresh, juicy blueberries and baked to a golden perfection with a tender, moist crumb.",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Chocolate Chip Muffin",
        category: "food",
        description: "Rich, moist muffin studded with premium chocolate chips, offering the perfect balance of sweetness in every bite.",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Banana Walnut Muffin",
        category: "food", 
        description: "Made with ripe bananas and crunchy walnuts, this moist muffin delivers natural sweetness and hearty texture.",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Lemon Poppy Seed Muffin",
        category: "food",
        description: "A bright, citrusy muffin with a tender crumb, featuring fresh lemon zest and a delicate poppy seed texture.",
        price: "$3.50", 
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Bran Muffin",
        category: "food",
        description: "Wholesome bran muffin with raisins, offering a hearty and healthy breakfast option.",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },

      // Hot Drinks (from your DoorDash screenshots)
      {
        name: "Espresso",
        category: "coffee",
        description: "A concentrated shot of pure coffee intensity, with a rich crema and bold, robust flavor profile.",
        price: "$2.25", 
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a",
        available: true
      },
      {
        name: "Double Espresso",
        category: "coffee",
        description: "Two shots of concentrated espresso for an intense coffee experience.",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a",
        available: true
      },
      {
        name: "Americano",
        category: "coffee",
        description: "Bold espresso shots diluted with hot water for a clean, strong coffee flavor.",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a",
        available: true
      },
      {
        name: "Cappuccino",
        category: "coffee",
        description: "Equal parts espresso, steamed milk, and velvety microfoam, creating the perfect harmony of coffee and cream.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d",
        available: true
      },
      {
        name: "Latte",
        category: "coffee",
        description: "Smooth espresso combined with steamed milk and a light layer of foam, perfect for coffee lovers who enjoy a creamy texture.",
        price: "$4.99",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d",
        available: true
      },
      {
        name: "Macchiato",
        category: "coffee",
        description: "Bold espresso 'marked' with a dollop of steamed milk foam, offering a perfect balance of strong coffee and creamy sweetness.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d",
        available: true
      },
      {
        name: "Mocha",
        category: "coffee",
        description: "Rich espresso blended with premium chocolate syrup and steamed milk, topped with whipped cream for the ultimate indulgence.",
        price: "$5.50",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d",
        available: true
      },
      {
        name: "Cortado",
        category: "coffee",
        description: "Spanish coffee drink with equal parts espresso and warm milk, served in a small glass.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d",
        available: true
      },
      {
        name: "Flat White",
        category: "coffee",
        description: "Strong espresso with microfoam milk, creating a velvety texture and rich coffee flavor.",
        price: "$4.99",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d",
        available: true
      },
      {
        name: "Arabic Coffee (Qahwa)",
        category: "coffee",
        description: "Traditional Arabic coffee infused with cardamom and saffron, served in the authentic Middle Eastern style.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a",
        available: true
      },
      {
        name: "Turkish Coffee",
        category: "coffee",
        description: "Finely ground coffee beans prepared in the traditional Turkish method, served with Turkish delight.",
        price: "$5.50",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a",
        available: true
      },
      {
        name: "Hot Chocolate",
        category: "tea",
        description: "Rich, creamy hot chocolate made with premium cocoa, steamed milk, and topped with fluffy whipped cream.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed",
        available: true
      },
      {
        name: "Chai Latte",
        category: "tea",
        description: "A warming blend of black tea, aromatic spices, and steamed milk, creating a comforting and flavorful drink.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Moroccan Mint Tea",
        category: "tea",
        description: "Authentic Moroccan green tea with fresh mint leaves, served sweet in traditional style.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },

      // Iced Drinks (from your DoorDash screenshots)
      {
        name: "Iced Coffee",
        category: "coffee",
        description: "Smooth, cold-brewed coffee served over ice, perfect for a refreshing caffeine boost on warm days.",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },
      {
        name: "Iced Americano",
        category: "coffee",
        description: "Bold espresso shots over ice with cold water for a refreshing strong coffee.",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },
      {
        name: "Iced Latte",
        category: "coffee",
        description: "Chilled espresso combined with cold milk and served over ice, offering a smooth and refreshing coffee experience.",
        price: "$4.99",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },
      {
        name: "Iced Cappuccino",
        category: "coffee",
        description: "Refreshing iced version of the classic cappuccino with cold foam and espresso.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },
      {
        name: "Iced Mocha",
        category: "coffee",
        description: "Cold espresso blended with chocolate syrup and milk, served over ice and topped with whipped cream.",
        price: "$5.50", 
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },
      {
        name: "Cold Brew",
        category: "coffee",
        description: "Smooth, concentrated coffee steeped in cold water for 12+ hours, resulting in a naturally sweet and less acidic flavor.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },
      {
        name: "Frappuccino",
        category: "coffee",
        description: "Blended ice coffee drink with milk and flavoring, topped with whipped cream for a perfect frozen treat.",
        price: "$6.50",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },

      // Juice (from your DoorDash screenshots)
      {
        name: "Fresh Orange Juice",
        category: "tea",
        description: "Freshly squeezed from ripe, juicy oranges, pure and refreshing, packed with natural vitamin C.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Fresh Apple Juice",
        category: "tea",
        description: "Crisp and refreshing, made from freshly pressed apples with no added sugars, delivering pure, natural sweetness.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Lemonade",
        category: "tea",
        description: "A refreshing blend of fresh lemons, pure water, and just the right amount of sweetness for the perfect balance.",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },

      // Sandwiches (from your DoorDash screenshots)
      {
        name: "Grilled Cheese",
        category: "food",
        description: "Classic grilled cheese sandwich with melted cheese on toasted bread, crispy and golden.",
        price: "$6.50",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
        available: true
      },
      {
        name: "Turkey & Swiss",
        category: "food",
        description: "Fresh turkey breast with Swiss cheese, lettuce, and tomato on your choice of bread.",
        price: "$8.50",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
        available: true
      },
      {
        name: "Ham & Cheddar",
        category: "food",
        description: "Sliced ham with cheddar cheese, lettuce, and tomato on fresh bread.",
        price: "$8.50",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
        available: true
      },
      {
        name: "Veggie Sandwich",
        category: "food",
        description: "Fresh vegetables with hummus, avocado, lettuce, tomato, and cucumber on whole grain bread.",
        price: "$7.50",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
        available: true
      },
      {
        name: "BLT",
        category: "food",
        description: "Classic bacon, lettuce, and tomato sandwich with mayo on toasted bread.",
        price: "$8.50",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
        available: true
      }
    ];

    menuData.forEach(item => {
      const id = this.currentMenuItemId++;
      this.menuItems.set(id, { ...item, id });
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
      loyaltyPoints: insertUser.loyaltyPoints || 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(id: number, points: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      user.loyaltyPoints = points;
      this.users.set(id, user);
      return user;
    }
    return undefined;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.category === category);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const item: MenuItem = { 
      ...insertItem, 
      id,
      createdAt: new Date()
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
    return Array.from(this.chatMessages.values()).filter(msg => msg.sessionId === sessionId);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPoints(id: number, points: number): Promise<User | undefined> {
    const [user] = await db.update(users).set({ loyaltyPoints: points }).where(eq(users.id, id)).returning();
    return user;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.category, category));
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const [item] = await db.insert(menuItems).values(insertItem).returning();
    return item;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    return message;
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(insertMessage).returning();
    return message;
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }
}

export const storage = new MemStorage();