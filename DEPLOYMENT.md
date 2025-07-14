# Railway Deployment Guide for Coffee Pro

## Quick Deployment Steps

### 1. Railway Setup
1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select this repository

### 2. Add Database
1. In your Railway project dashboard, click "New Service"
2. Select "Database" > "PostgreSQL"
3. Railway will automatically create a PostgreSQL database and provide the `DATABASE_URL`

### 3. Environment Variables
Set these in Railway's Variables tab:

```
DATABASE_URL=postgresql://... (automatically set by Railway)
SESSION_SECRET=coffee-pro-super-secure-session-key-2024
ADMIN_PASSWORD=your-secure-admin-password
NODE_ENV=production
```

### 4. Deploy
1. Railway will automatically build and deploy your application
2. Once deployed, you'll get a URL like: `https://your-app-name.railway.app`

### 5. Database Setup
1. In Railway's console, run: `npm run db:push`
2. This creates all necessary tables

## Alternative: Simpler Deployment (if build fails)

If you encounter build issues with Railway, you can deploy in development mode:

1. **Update railway.json** to use development mode:
   ```json
   {
     "deploy": {
       "startCommand": "npm run dev"
     }
   }
   ```

2. **Set environment variables**:
   ```
   NODE_ENV=development
   SESSION_SECRET=your-secret-key
   ADMIN_PASSWORD=your-admin-password
   ```

3. **Deploy**: Railway will run in development mode with hot reloading

### 6. Post-Deployment Setup
1. Visit: `https://your-app-name.railway.app/admin`
2. Login with your admin password
3. Download both QR codes from the admin dashboard
4. Print and display them in your Coffee Pro store

## Cost Breakdown
- **Railway Starter Plan**: $5/month
- **Includes**: Web hosting + PostgreSQL database + 512MB RAM + 1GB storage
- **No cold starts**: Always-on service

## Features Ready After Deployment
- ✅ QR code loyalty system with location validation
- ✅ Customer check-in with 5-point rewards
- ✅ Admin dashboard for customer management
- ✅ Marketing contact collection
- ✅ Website QR code for menu access
- ✅ Real-time location-based check-ins
- ✅ Franchise application system
- ✅ SEO optimized for local search

## Store Information (Already Configured)
- **Location**: 23-33 Astoria Blvd, Astoria, NY 11102
- **Phone**: (347) 329-6816
- **Email**: Coffeepro23@gmail.com
- **QR Code Range**: 100m radius from store

## Support
If you encounter any issues during deployment:
1. Check Railway logs in the dashboard
2. Verify all environment variables are set
3. Ensure the database connection is working
4. Test the QR code system after deployment

Your Coffee Pro digital platform will be live and ready for customers!