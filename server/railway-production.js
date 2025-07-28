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
    
    // Try multiple possible locations for built modules
    const possibleLocations = [
      "../dist/server/routes.js",
      "./routes.js", 
      "../server/routes.js",
      "./dist/routes.js"
    ];
    
    let routesModule, dbModule;
    
    for (const location of possibleLocations) {
      try {
        console.log(`🔍 Trying to import routes from: ${location}`);
        routesModule = await import(location);
        // If routes import succeeds, try db from same location
        const dbLocation = location.replace('routes.js', 'db.js');
        dbModule = await import(dbLocation);
        console.log(`✅ Successfully imported from: ${location}`);
        break;
      } catch (err) {
        console.log(`❌ Failed to import from: ${location} - ${err.message}`);
        continue;
      }
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

// Initialize PostgreSQL session store
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
      createTableIfMissing: true,
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

// Serve static files - try multiple possible locations
let distPath;
const possiblePaths = [
  process.env.CLIENT_BUILD_PATH,
  path.resolve(process.cwd(), "dist", "client"),
  path.resolve(process.cwd(), "public"),
  path.resolve(process.cwd(), "client", "dist"),
  path.resolve(__dirname, "..", "dist", "client"),
  path.resolve(__dirname, "..", "public")
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
  process.exit(1);
}

console.log(`📁 Serving static files from: ${distPath}`);
app.use(express.static(distPath));

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
    await registerRoutes(app);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Coffee Pro server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
      console.log(`📁 Static files served from: ${distPath}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();