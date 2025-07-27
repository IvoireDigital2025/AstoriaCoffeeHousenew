import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.js";
import { pool } from "./db.js";
import connectPgSimple from "connect-pg-simple";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Redirect HTTP to HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// Serve attached assets
app.use("/attached_assets", express.static("attached_assets"));

// Create PostgreSQL session store
const pgSession = connectPgSimple(session);

// Session configuration for production with database store
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "coffee-pro-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    name: "coffee-pro-session",
  })
);

// Register API routes
registerRoutes(app);

// Serve static files from dist
const distPath = path.resolve(__dirname, "..", "dist", "client");
app.use(express.static(distPath));

// Serve index.html for all other routes (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Coffee Pro server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});