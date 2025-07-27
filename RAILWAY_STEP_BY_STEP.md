# Coffee Pro - Railway Deployment Walkthrough

## 🎯 Step-by-Step Deployment Guide

### Step 1: Access Railway
1. Open your browser and go to **https://railway.app**
2. Click **"Login"** in the top right
3. Select **"Continue with GitHub"**
4. Authorize Railway to access your GitHub repositories

### Step 2: Create New Project
1. On Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your **Coffee Pro repository**
4. Railway will automatically detect it's a Node.js project

### Step 3: Add PostgreSQL Database
1. In your new project dashboard, click **"New Service"**
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Railway creates the database and generates `DATABASE_URL` automatically

### Step 4: Configure Environment Variables
Click on your web service, then **"Variables"** tab:

**Add these variables:**
```
NODE_ENV = production
SESSION_SECRET = your-secure-random-string-here
ADMIN_PASSWORD = Coffeeproegypt
```

**Note:** `DATABASE_URL` is automatically added by the PostgreSQL service

### Step 5: Deploy
1. Railway automatically starts building after you add the repository
2. Watch the build logs in the **"Deployments"** tab
3. Build process will:
   - Install dependencies (`npm ci`)
   - Run database migration (`npm run db:push`)
   - Build the application (`npm run build`)
   - Start the server (`npm start`)

### Step 6: Access Your Site
1. In the web service, click **"Settings"**
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. Your Coffee Pro website will be live at: `your-app-name.railway.app`

### Step 7: Verify Everything Works
Test these features on your live site:
- ✅ Homepage loads with Coffee Pro branding
- ✅ Menu page displays all categories
- ✅ Contact form submissions work
- ✅ Admin dashboard login (`/admin-dashboard`)
- ✅ QR loyalty system (`/loyalty-checkin`)
- ✅ Franchise applications

### Troubleshooting Tips

**If build fails:**
- Check **"Deployments"** tab for error logs
- Ensure all environment variables are set
- Database should be running before web service

**If admin login doesn't work:**
- Verify `ADMIN_PASSWORD = Coffeeproegypt`
- Check `SESSION_SECRET` is set
- Database tables should be created automatically

**If database connection fails:**
- PostgreSQL service should show "Active" status
- `DATABASE_URL` should be automatically linked

### Expected Build Time
- First deployment: 3-5 minutes
- Subsequent deployments: 1-2 minutes

### Your Live Coffee Pro Features
Once deployed, all these features will work:
- Public website with menu and location info
- Contact form with email collection
- Newsletter signup forms
- Admin dashboard for managing contacts
- QR code loyalty program with geolocation
- Franchise application system
- All your authentic Coffee Pro photos and branding

Railway's superior Node.js support means no build failures or dependency issues like Render.