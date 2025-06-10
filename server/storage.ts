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
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

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
      // Hot Coffee Drinks
      {
        name: "Mocha",
        category: "coffee",
        description: "A rich blend of bold espresso, smooth steamed milk, and high-quality Belgian milk chocolate for a luxurious, velvety taste. Topped with fluffy whipped cream for the perfect finish.",
        price: "$7.49",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        available: true
      },
      {
        name: "Classic Matcha Latte",
        category: "coffee",
        description: "At Coffee Pro, enjoy our Classic Matcha Latte, made with premium matcha powder, blended with steamed milk for a smooth, creamy, and earthy flavor that's both refreshing and energizing.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Latte",
        category: "coffee",
        description: "A smooth and creamy coffee made with rich espresso and steamed milk, creating a mellow and satisfying drink that's perfect for any time of day.",
        price: "$5.99",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },
      {
        name: "Flat White",
        category: "coffee",
        description: "A smooth and velvety coffee made with rich espresso and steamed milk, offering a creamy texture without the foam of a cappuccino.",
        price: "$4.49",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
        available: true
      },
      {
        name: "Cappuccino",
        category: "coffee",
        description: "A classic coffee drink made with equal parts rich espresso, steamed milk, and velvety foam. The perfect balance of strong coffee and creamy indulgence.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d",
        available: true
      },
      {
        name: "Hot V60",
        category: "coffee",
        description: "A meticulously brewed pour-over coffee, made with high-quality beans for a clean, smooth cup. The V60 method enhances the natural flavors and aromas of the coffee.",
        price: "$7.49",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
        available: true
      },
      {
        name: "Cortado",
        category: "coffee",
        description: "A perfectly balanced coffee drink made with bold espresso and an equal amount of steamed milk, creating a smooth, rich texture with the perfect coffee-to-milk ratio.",
        price: "$4.99",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a",
        available: true
      },
      {
        name: "Chai Latte",
        category: "tea",
        description: "A warm and aromatic blend of spiced black tea and steamed milk, infused with cinnamon, cardamom, ginger, and cloves. Creamy, comforting, and perfectly spiced.",
        price: "$4.99",
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f",
        available: true
      },
      {
        name: "Dirty Chai Latte",
        category: "tea",
        description: "A bold twist on the classic chai latte, combining spiced black tea, steamed milk, and a shot of rich espresso. Smooth, creamy, and energizing.",
        price: "$6.49",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        available: true
      },
      {
        name: "Tea",
        category: "tea",
        description: "Tea Selection: A carefully curated selection of premium teas, from bold and classic black teas to refreshing herbal and fruity blends.",
        price: "$3.99",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Espresso",
        category: "coffee",
        description: "Espresso (Paris & Swiss Style) A rich, concentrated shot of espresso served in the classic Parisian and Swiss style, with bold, smooth, and aromatic coffee flavors.",
        price: "$2.99",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a",
        available: true
      },
      {
        name: "Drip Coffee",
        category: "coffee",
        description: "A classic, smooth coffee brewed to perfection with freshly ground beans, delivering a rich and flavorful cup. Clean and well-balanced.",
        price: "$3.99",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
        available: true
      },
      
      // Iced Coffee Drinks
      {
        name: "Iced Maple Oat",
        category: "coffee",
        description: "A smooth and creamy blend of espresso, oat milk, and pure maple syrup, served over ice for a refreshing and indulgent treat.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
        available: true
      },
      {
        name: "Iced Latte",
        category: "coffee",
        description: "A chilled, creamy blend of espresso and cold milk, served over ice for a refreshing, smooth coffee experience.",
        price: "$6.49",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },
      {
        name: "Iced V60",
        category: "coffee",
        description: "A meticulously brewed pour-over coffee, flash-chilled over ice to preserve its rich, concentrated flavor and natural sweetness.",
        price: "$6.49",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
        available: true
      },
      {
        name: "Peach Rosemary Iced",
        category: "tea",
        description: "A refreshing blend of sweet peach and aromatic rosemary, served chilled over ice for a unique and invigorating drink.",
        price: "$5.99",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Iced Matcha",
        category: "tea",
        description: "A smooth and refreshing blend of high-quality matcha and creamy milk, served over ice for a cool, energizing treat.",
        price: "$6.49",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Iced Americano",
        category: "coffee",
        description: "A bold and refreshing coffee made with rich espresso shots, poured over ice and topped with cold water.",
        price: "$4.49",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
        available: true
      },
      {
        name: "Hibiscus Iced Tea",
        category: "tea",
        description: "A vibrant and refreshing herbal tea brewed from dried hibiscus flowers, served chilled over ice with a tart and floral flavor.",
        price: "$5.99",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Iced Matcha Latte",
        category: "tea",
        description: "A refreshing blend of high-quality matcha and creamy milk, served over ice for a smooth, cool, and energizing experience.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Iced Cappuccino",
        category: "coffee",
        description: "A refreshing twist on the classic cappuccino, featuring bold espresso, cold milk, and a layer of foam, served over ice.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d",
        available: true
      },
      {
        name: "Iced Macchiato",
        category: "coffee",
        description: "A bold and smooth espresso layered over chilled milk and ice, creating a rich, balanced flavor with a hint of natural sweetness.",
        price: "$6.49",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },
      {
        name: "Iced Chai Latte",
        category: "tea",
        description: "A refreshing blend of spiced chai tea and creamy milk, served over ice for a smooth, cool, and aromatic experience.",
        price: "$5.49",
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f",
        available: true
      },
      {
        name: "Ice Dirty Chai Latte",
        category: "tea",
        description: "A bold and refreshing blend of spiced chai tea, creamy milk, and a shot of espresso, served over ice for a cool, energizing treat.",
        price: "$6.49",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        available: true
      },
      {
        name: "Iced Mocha",
        category: "coffee",
        description: "A rich blend of bold espresso, creamy milk, and smooth chocolate, served over ice for a refreshing and indulgent treat. The perfect balance of coffee and chocolate.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        available: true
      },
      {
        name: "Pro Frappe",
        category: "coffee",
        description: "A rich and creamy blended coffee drink with a smooth texture and bold flavor, perfect for a refreshing treat.",
        price: "$7.99",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        available: true
      },
      {
        name: "Cold Brew",
        category: "coffee",
        description: "A smooth, rich coffee brewed slowly over time to extract deep, bold flavors without bitterness, served chilled for a refreshing experience.",
        price: "$5.49",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
        available: true
      },

      // Menu Pastry & Desserts
      {
        name: "Dubai Chocolate",
        category: "food",
        description: "A decadent single serving of Belgian chocolate, expertly crafted with a rich pistachio butter filling.",
        price: "$7.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Dubai Chocolate Medium - Sweet Time",
        category: "food",
        description: "A luxurious treat crafted with a Belgian chocolate shell, filled with a rich blend of pistachio butter and premium nuts.",
        price: "$17.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Dubai Chocolate Large - Sweet Time",
        category: "food",
        description: "A luxurious treat crafted with a Belgian chocolate shell, filled with a rich blend of pistachio butter and premium nuts.",
        price: "$29.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Almond Croissant",
        category: "food",
        description: "A buttery, flaky pastry filled with almond cream and topped with sliced almonds for a delightful, nutty flavor.",
        price: "$6.74",
        image: "https://images.unsplash.com/photo-1555507036-ab794f27e53e",
        available: true
      },
      {
        name: "Chocolate Croissant",
        category: "food",
        description: "A flaky, buttery pastry filled with rich, melty chocolate. Our Chocolate Croissant is perfectly balanced with a golden, crispy exterior.",
        price: "$5.99",
        image: "https://images.unsplash.com/photo-1555507036-ab794f27e53e",
        available: true
      },
      {
        name: "Sacher Torte",
        category: "food",
        description: "Classic Austrian Chocolate Cake - Sachertorte At Coffee Pro, enjoy our classic Viennese dessert.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Chocolate Tiramisu",
        category: "food",
        description: "A luxurious twist on the classic Italian dessert, featuring layers of espresso-soaked ladyfingers and rich chocolate mascarpone cream.",
        price: "$7.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Semifreddo Al Pistachio",
        category: "food",
        description: "A creamy and indulgent frozen dessert made with rich pistachio paste, whipped cream, and a touch of sweetness.",
        price: "$8.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Cheddar Chive Scone",
        category: "food",
        description: "A savory delight, our Cheddar Chive Scone is packed with sharp cheddar cheese and fresh chives for a rich, flavorful treat.",
        price: "$4.99",
        image: "https://images.unsplash.com/photo-1555507036-ab794f27e53e",
        available: true
      },
      {
        name: "Mohalabia pro",
        category: "food",
        description: "An Egyptian dessert made with rich heavy cream, whole milk, and vanilla, creating a smooth and creamy pudding topped with nuts.",
        price: "$6.49",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Dubai Cheese Bomb",
        category: "food",
        description: "A decadent dessert featuring rich, creamy cheese filling wrapped in a delicate pastry shell.",
        price: "$14.00",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "San Sebastian Cheesecake",
        category: "food",
        description: "A lighter, creamier cheesecake with a signature caramelized, burnt top for a unique and indulgent dessert experience.",
        price: "$8.49",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Mahalabia Mo Pro",
        category: "food",
        description: "An Egyptian dessert made with rich heavy cream, whole milk, and vanilla, indulgent and creamy.",
        price: "$9.50",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "French Toast - Pro",
        category: "food",
        description: "Signature Coffee Pro French Toast - layered with creamy pistachio butter, Belgian milk chocolate, and a touch of sweetness.",
        price: "$7.99",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
        available: true
      },
      {
        name: "Butter Croissant",
        category: "food",
        description: "Flaky, buttery, and irresistibly golden, our butter croissant is a classic French pastry made with premium butter for the perfect texture.",
        price: "$4.99",
        image: "https://images.unsplash.com/photo-1555507036-ab794f27e53e",
        available: true
      },

      // Muffins
      {
        name: "3 Muffin Combo",
        category: "food",
        description: "Combination of Blueberry, Milk Chocolate and Dubai Chocolate muffins. Made in-house with premium ingredients.",
        price: "$15.00",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
        available: true
      },
      {
        name: "Milk Chocolate Muffin",
        category: "food",
        description: "A smooth and creamy treat, baked fresh at Coffee Pro 2333 Astoria BLVD. Infused with rich milk chocolate for pure indulgence.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
        available: true
      },
      {
        name: "Dark Chocolate Muffin",
        category: "food",
        description: "Indulge in deep chocolate flavor with this rich, decadent muffin from Coffee Pro 2333 Astoria BLVD. Made with premium dark cocoa and chocolate chips.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
        available: true
      },
      {
        name: "Dubai Muffin (Kunafa & Pistachios)",
        category: "food",
        description: "Experience Middle Eastern flavors in every bite with this specialty from Coffee Pro 2333 Astoria BLVD. Features traditional kunafa and pistachios.",
        price: "$7.99",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
        available: true
      },
      {
        name: "Almond Muffin",
        category: "food",
        description: "A nutty delight, freshly made at Coffee Pro 2333 Astoria BLVD. This soft and moist muffin features toasted almond flakes.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
        available: true
      },

      // Juices
      {
        name: "Brazilian Lemon",
        category: "tea",
        description: "A creamy and refreshing twist on classic lemonade, made with fresh limes, a touch of condensed milk for richness.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Strawberry Lemonade",
        category: "tea",
        description: "A refreshing blend of fresh strawberries and zesty lemons, perfectly balanced with just the right amount of sweetness.",
        price: "$5.99",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Orange Juice",
        category: "tea",
        description: "Freshly squeezed from ripe, juicy oranges, our orange juice is pure, refreshing, and packed with natural vitamin C.",
        price: "$5.99",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Lemonade",
        category: "tea",
        description: "A refreshing blend of fresh lemons, pure water, and just the right amount of sweetness for the perfect balance.",
        price: "$4.99",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },

      // Sandwiches
      {
        name: "Japanese Mayo Egg",
        category: "food",
        description: "A delicate Japanese-inspired recipe made with perfectly boiled eggs, finely chopped and mixed with creamy Japanese mayo.",
        price: "$8.49",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
        available: true
      },
      {
        name: "Turkey & Cheddar",
        category: "food",
        description: "A classic combination of lean turkey and sharp cheddar cheese, served on fresh bread for a satisfying and flavorful meal.",
        price: "$8.49",
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
}

export const storage = new DatabaseStorage();
