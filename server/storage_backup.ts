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
      },

      // Additional Coffee Drinks from DoorDash
      {
        name: "Arabic Coffee (Qahwa)",
        category: "coffee",
        description: "Traditional Arabic coffee infused with cardamom and saffron, served in the authentic Middle Eastern style.",
        price: "$4.99",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a",
        available: true
      },
      {
        name: "Moroccan Mint Tea (Atay)",
        category: "tea",
        description: "Authentic Moroccan green tea with fresh mint leaves, served sweet in traditional style.",
        price: "$4.49",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        available: true
      },
      {
        name: "Turkish Coffee",
        category: "coffee",
        description: "Finely ground coffee beans prepared in the traditional Turkish method, served with Turkish delight.",
        price: "$5.99",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a",
        available: true
      },
      {
        name: "Sahlab",
        category: "tea",
        description: "Warm Middle Eastern milk drink made with orchid flour, topped with cinnamon and nuts.",
        price: "$5.49",
        image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed",
        available: true
      },

      // Additional Pastries and Desserts
      {
        name: "Baklava",
        category: "food",
        description: "Layers of phyllo pastry filled with chopped nuts and sweetened with honey syrup.",
        price: "$4.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Knafeh",
        category: "food",
        description: "Traditional Middle Eastern dessert made with crispy kadaif noodles and sweet cheese, soaked in sugar syrup.",
        price: "$7.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Turkish Delight",
        category: "food",
        description: "Soft, gel-like confection dusted with powdered sugar, available in rose and lemon flavors.",
        price: "$3.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Halva",
        category: "food",
        description: "Traditional Middle Eastern sweet confection made from tahini and honey.",
        price: "$5.49",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },
      {
        name: "Ma'amoul",
        category: "food",
        description: "Traditional shortbread cookies filled with dates, nuts, or figs, dusted with powdered sugar.",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        available: true
      },

      // Breakfast Items
      {
        name: "Shakshuka",
        category: "food",
        description: "Eggs poached in a sauce of tomatoes, olive oil, peppers, onion and garlic, commonly spiced with cumin, paprika and cayenne pepper.",
        price: "$12.99",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
        available: true
      },
      {
        name: "Manakish Za'atar",
        category: "food",
        description: "Traditional flatbread topped with za'atar spice blend and olive oil, baked to perfection.",
        price: "$7.49",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
        available: true
      },
      {
        name: "Labneh with Olive Oil",
        category: "food",
        description: "Thick, creamy Middle Eastern yogurt cheese drizzled with extra virgin olive oil and herbs.",
        price: "$6.99",
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
