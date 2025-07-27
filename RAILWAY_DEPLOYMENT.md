# Coffee Pro - Railway Deployment Guide

## 🚀 Railway Deployment Setup

Railway is the recommended hosting platform for Coffee Pro due to its excellent Node.js support and seamless PostgreSQL integration.

### Prerequisites
- GitHub repository with Coffee Pro code
- Railway account (free tier available)

### Deployment Steps

#### 1. Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your Coffee Pro repository

#### 2. Add PostgreSQL Database
1. In your Railway project dashboard
2. Click "New Service"
3. Select "Database" → "PostgreSQL"
4. Railway automatically creates DATABASE_URL environment variable

#### 3. Configure Environment Variables
Add these environment variables in Railway dashboard:

**Required Variables:**
```
NODE_ENV=production
SESSION_SECRET=your-secure-session-secret-here
ADMIN_PASSWORD=Coffeeproegypt
DATABASE_URL=(automatically provided by Railway PostgreSQL)
```

#### 4. Deployment Process
Railway automatically:
1. Installs dependencies with `npm ci`
2. Runs database migration with `npm run db:push`
3. Builds the application with `npm run build`
4. Starts the server with `npm start`

### 🎯 Why Railway Works Better

**Database Integration:**
- Automatic PostgreSQL setup with internal networking
- DATABASE_URL environment variable auto-configured
- No SSL configuration needed
- Built-in connection pooling

**Build Process:**
- Better memory management than Render
- Supports both ES modules and CommonJS
- Drizzle-kit works without modifications
- Faster builds and deployments

**Your Coffee Pro Features:**
✅ Admin dashboard with session authentication
✅ QR code loyalty system with location validation
✅ Contact forms and franchise applications
✅ Marketing contact collection
✅ All PostgreSQL tables created automatically

### 🔧 Files Configured for Railway

**railway.json** - Railway configuration
**nixpacks.toml** - Build and deployment instructions
**package.json** - Already configured with correct scripts
**drizzle.config.ts** - Database configuration ready

### 🌐 Domain Setup
- Railway provides automatic subdomain: `your-app.railway.app`
- Custom domain can be added in project settings
- SSL certificate automatically provisioned

### 📊 Database Management
- Access database via Railway dashboard
- Built-in query editor
- Automatic backups on paid plans
- Easy scaling options

### 🎉 Post-Deployment
After successful deployment:
1. Visit your Railway app URL
2. Test admin login at `/admin-dashboard`
3. Verify all forms and QR code system
4. Check database tables are created

Railway provides much more reliable deployment for full-stack applications like Coffee Pro compared to Render's build issues.