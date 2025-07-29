import express from "express";
import session from "express-session";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

let registerRoutes, pool;

try {
  const routesModule = await import("../dist/server/routes.js");
  const dbModule = await import("../dist/server/db.js");
  registerRoutes = routesModule.registerRoutes;
  pool = dbModule.pool;
  console.log("📦 Using built server modules");
} catch (error) {
  try {
    const routesModule = await import("./routes.js");
    const dbModule = await import("./db.js");
    registerRoutes = routesModule.registerRoutes;
    pool = dbModule.pool;
    console.log("📦 Using source server modules");
  } catch (fallbackError) {
    console.error("❌ Could not import server modules:", fallbackError.message);
    process.exit(1);
  }
}
import connectPgSimple from "connect-pg-simple";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust the first proxy (Render requirement)
app.set('trust proxy', 1);

// Enforce HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(301, "https://" + req.headers.host + req.url);
  }
  next();
});

// Serve attached assets
app.use("/attached_assets", express.static("attached_assets"));

const pgSession = connectPgSimple(session);

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "user_sessions", // <- Must match your DB table!
      createTableIfMissing: true,
      errorLog: (error) => {
        console.error("Session store error:", error);
      }
    }),
    secret: process.env.SESSION_SECRET || "coffee-pro-secret-key-render-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // <-- REQUIRED for Render
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none", // <-- REQUIRED for cross-origin on Render
      domain: undefined, // Let browser default unless you know you need this!
    },
    name: "coffee-pro-session", // <-- Must match what your frontend expects!
    proxy: true, // <-- Required for secure cookies behind proxy
  })
);

let distPath;
const possiblePaths = [
  path.resolve(__dirname, "..", "dist", "client"),
  path.resolve(__dirname, "..", "public"),
  path.resolve(__dirname, "..", "client", "dist"),
  path.resolve(process.cwd(), "dist", "client"),
  path.resolve(process.cwd(), "public")
];

for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath)) {
    distPath = testPath;
    break;
  }
}

if (!distPath) {
  console.error("❌ Could not find client build directory");
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

// Register API routes and start server
(async () => {
  try {
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
})();
