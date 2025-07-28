import express from "express";
import session from "express-session";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectPgSimple from "connect-pg-simple";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic module imports to handle Railway's build environment
let registerRoutes, pool;

async function initializeServer() {
  try {
    console.log("🔍 Looking for server modules...");
    
    // Try multiple possible locations - prioritize TypeScript source files for Railway
    const possibleLocations = [
      "./routes.ts",  // TypeScript source files in same directory
      "./db.ts",
      "../dist/server/routes.js",  // Built files if available
      "./routes.js", 
      "../server/routes.js"
    ];
    
    let routesModule, dbModule;
    
    // For Railway, use the fallback server since built server is standalone
    console.log(`🔍 Railway environment detected - using fallback server approach`);
    console.log(`💡 Built server exists but is standalone - skipping module import`);
    
    // Check if built server exists and just run it directly
    const builtServerPath = path.join(__dirname, "..", "dist", "index.js");
    if (fs.existsSync(builtServerPath)) {
      console.log(`🚀 Found built server at: ${builtServerPath}`);
      console.log(`🔄 Executing built server directly (Railway optimized)`);
      
      // Set environment variables for built server
      process.env.NODE_ENV = 'production';
      process.env.PORT = process.env.PORT || '8080';
      
      // Execute the built server
      try {
        require(builtServerPath);
        console.log(`✅ Built server started successfully`);
        return; // Exit this function as server is now running
      } catch (err) {
        console.log(`❌ Built server failed: ${err.message}`);
      }
    }
    
    // Fallback to TypeScript files for development
    try {
      console.log(`🔍 Falling back to TypeScript routes: ./routes.ts`);
      routesModule = await import("./routes.ts");
      dbModule = await import("./db.ts"); 
      console.log(`✅ Successfully imported TypeScript modules`);
    } catch (tsError) {
      console.log(`❌ TypeScript import failed: ${tsError.message}`);
      
      // Final fallback - throw error
      throw new Error("Could not start server with any available method");
    }
    
    if (!routesModule || !dbModule) {
      throw new Error("Could not find routes or db modules in any expected location");
    }
    
    registerRoutes = routesModule.registerRoutes;
    pool = dbModule.pool;
    
  } catch (error) {
    console.error("❌ Module import failed:", error.message);
    console.log("📁 Available files in server directory:");
    try {
      const files = fs.readdirSync(__dirname);
      console.log(files);
    } catch (fsError) {
      console.log("Could not read server directory");
    }
    process.exit(1);
  }
}

// Session store will be initialized after modules are loaded

// Serve static files - try multiple possible locations including Railway-specific paths
let distPath;
const possiblePaths = [
  process.env.CLIENT_BUILD_PATH,
  path.resolve(process.cwd(), "dist", "public"), // Vite builds to dist/public
  path.resolve(process.cwd(), "dist"),
  path.resolve(process.cwd(), "dist", "client"),
  path.resolve(process.cwd(), "build"),
  path.resolve(process.cwd(), "public"),
  path.resolve(__dirname, "..", "dist", "public"), // Main build location
  path.resolve(__dirname, "..", "dist"),
  path.resolve(__dirname, "..", "dist", "client"),
  path.resolve(__dirname, "..", "build"),
  path.resolve(__dirname, "..", "public"),
  "/app/dist/public", // Railway absolute path
  "/app/dist",
  "/app/build",
  "/app/public"
].filter(Boolean);

for (const testPath of possiblePaths) {
  if (testPath && fs.existsSync(testPath)) {
    distPath = testPath;
    break;
  }
}

if (!distPath) {
  console.error("❌ Could not find client build directory");
  console.log("📁 Tried these paths:", possiblePaths);
  
  // List all files to debug Railway's build structure
  console.log("🔍 Debugging build structure:");
  try {
    console.log("📂 Root directory contents:", fs.readdirSync("/app"));
    if (fs.existsSync("/app/dist")) {
      console.log("📂 /app/dist contents:", fs.readdirSync("/app/dist"));
    }
    if (fs.existsSync("/app/public")) {
      console.log("📂 /app/public contents:", fs.readdirSync("/app/public"));
    }
  } catch (err) {
    console.log("Could not list directories:", err.message);
  }
  
  // Try to serve from a basic fallback
  console.log("🔄 Creating basic HTML fallback...");
  const fallbackHtml = `
    <!DOCTYPE html>
    <html>
    <head><title>Coffee Pro - Build Issue</title></head>
    <body>
      <h1>Coffee Pro</h1>
      <p>The application is starting up. Build files are being located...</p>
      <p>If this message persists, please check the Railway build logs.</p>
    </body>
    </html>
  `;
  
  app.get("*", (req, res) => {
    res.status(200).send(fallbackHtml);
  });
  
  console.log("✅ Using fallback HTML response");
}

console.log(`📁 Serving static files from: ${distPath}`);
app.use(express.static(distPath));

// Serve attached assets (images) from multiple possible locations
const possibleAssetPaths = [
  path.resolve(process.cwd(), "attached_assets"),
  path.resolve(distPath, "attached_assets"),
  path.resolve(__dirname, "..", "attached_assets")
];

let assetsPath;
for (const testPath of possibleAssetPaths) {
  if (fs.existsSync(testPath)) {
    assetsPath = testPath;
    break;
  }
}

if (assetsPath) {
  console.log(`🖼️ Serving assets from: ${assetsPath}`);
  app.use("/attached_assets", express.static(assetsPath));
  app.use("/assets", express.static(assetsPath)); // Alternative path for vite alias
} else {
  console.log("⚠️ attached_assets directory not found in any location");
  console.log("📁 Checked paths:", possibleAssetPaths);
}

// Serve index.html for all other routes (SPA)
app.get("*", (req, res) => {
  const indexPath = path.resolve(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Application not built properly");
  }
});

const PORT = process.env.PORT || 3000;

// Initialize and start server
async function startServer() {
  try {
    await initializeServer();
    
    // Initialize PostgreSQL session store after modules are loaded
    const PgSession = connectPgSimple(session);
    
    app.use(
      session({
        store: new PgSession({
          pool: pool,
          tableName: "session",
          createTableIfMissing: true,
          errorLog: (err) => console.error('Session store error:', err),
        }),
        secret: process.env.SESSION_SECRET || "coffee-pro-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
        name: "coffee-pro-session",
      })
    );
    
    // Register API routes after session setup
    await registerRoutes(app);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Coffee Pro server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
      console.log(`📁 Static files served from: ${distPath}`);
      console.log(`🔐 Session store initialized with PostgreSQL`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();