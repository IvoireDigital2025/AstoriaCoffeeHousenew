# Coffee Pro - Render Deployment Quick Start

## 🚀 Deploy in 5 Minutes

### Method 1: One-Click Blueprint Deployment (Recommended)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Deploy to Render**:
   - Go to [render.com](https://render.com)
   - Click "New" > "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and create both services

3. **Set Environment Variables**:
   - During setup, you'll be prompted for:
     - `ADMIN_PASSWORD`: Your admin dashboard password
   - Render automatically sets:
     - `DATABASE_URL`: PostgreSQL connection
     - `SESSION_SECRET`: Auto-generated secure key
     - `NODE_ENV`: Set to "production"

4. **Deploy**: Click "Apply" and wait 3-5 minutes

5. **Setup Database**:
   - Go to your web service dashboard
   - Click "Shell" or "Console"
   - Run: `npm run db:push`

### Method 2: Manual Deployment

If blueprint doesn't work:

1. **Create Database Service**:
   - New > PostgreSQL
   - Name: `coffee-pro-db`
   - Plan: Starter ($7/month)

2. **Create Web Service**:
   - New > Web Service
   - Connect your repository
   - Build: `npm ci && npm run build`
   - Start: `npm start`

3. **Environment Variables**:
   ```
   NODE_ENV=production
   SESSION_SECRET=your-secure-key
   ADMIN_PASSWORD=your-admin-password
   DATABASE_URL=postgresql://... (from database)
   ```

## ✅ After Deployment

1. **Access Admin**: `https://your-app.onrender.com/admin`
2. **Download QR Codes**: Print loyalty and website QR codes
3. **Test Features**: Check loyalty system, contact forms, etc.

## 💰 Cost
- Web Service: $7/month
- Database: $7/month
- **Total: $14/month**

## 🔧 Features Included
- QR code loyalty system with location validation
- Admin dashboard for customer management
- Marketing contact collection
- SEO optimization for local search
- Mobile-responsive design
- Secure HTTPS with SSL

## 🏪 Store Ready
All store information is pre-configured:
- **Location**: 23-33 Astoria Blvd, Astoria, NY 11102
- **Phone**: (347) 329-6816
- **Email**: Coffeepro23@gmail.com

Your Coffee Pro website will be live and ready for customers!