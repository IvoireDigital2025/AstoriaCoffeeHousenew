import { 
  users, 
  menuItems,
  contactMessages,
  chatMessages,
  type User, 
  type InsertUser,
  type MenuItem,
  type InsertMenuItem,
  type ContactMessage,
  type InsertContactMessage,
  type ChatMessage,
  type InsertChatMessage
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
      {
        name: "Signature Espresso",
        category: "coffee",
        description: "Rich, bold espresso with notes of chocolate and caramel",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a" as string,
        available: true
      },
      {
        name: "Artisan Latte",
        category: "coffee",
        description: "Smooth espresso with steamed milk and beautiful latte art",
        price: "$4.75",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },
      {
        name: "Cold Brew",
        category: "coffee",
        description: "Slow-steeped for 12 hours, smooth and refreshing",
        price: "$4.25",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
        available: true
      },
      {
        name: "Cappuccino",
        category: "coffee",
        description: "Equal parts espresso, steamed milk, and milk foam",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d",
        available: true
      },
      {
        name: "Americano",
        category: "coffee",
        description: "Rich espresso with hot water for a clean, bold taste",
        price: "$3.75",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
        available: true
      },
      {
        name: "Mocha",
        category: "coffee",
        description: "Espresso with chocolate syrup and steamed milk",
        price: "$5.25",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        available: true
      },
      {
        name: "Green Tea Latte",
        category: "tea",
        description: "Premium matcha powder with steamed milk",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Chai Tea Latte",
        category: "tea",
        description: "Spiced black tea with steamed milk and honey",
        price: "$4.25",
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f",
        available: true
      },
      {
        name: "Hot Chocolate",
        category: "tea",
        description: "Rich Belgian chocolate with steamed milk and whipped cream",
        price: "$3.75",
        image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed",
        available: true
      },
      {
        name: "Croissant",
        category: "food",
        description: "Buttery, flaky French pastry baked fresh daily",
        price: "$3.25",
        image: "https://images.unsplash.com/photo-1555507036-ab794f27e53e",
        available: true
      },
      {
        name: "Avocado Toast",
        category: "food",
        description: "Fresh avocado on artisan sourdough with sea salt",
        price: "$8.50",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
        available: true
      },
      {
        name: "Blueberry Muffin",
        category: "food",
        description: "House-made muffin with fresh blueberries",
        price: "$3.75",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
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
}

export const storage = new MemStorage();
