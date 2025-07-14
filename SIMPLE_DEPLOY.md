# Simple One-Click Deployment

## Option 1: Railway (Simplified)

1. **Connect your GitHub repository to Railway**
2. **Set these environment variables in Railway:**
   ```
   NODE_ENV=development
   SESSION_SECRET=coffee-pro-secure-key-2025
   ADMIN_PASSWORD=CoffeePro2025!
   ```
3. **Override the build settings in Railway:**
   - Build Command: `npm install`
   - Start Command: `npm run dev`

That's it! Railway will deploy in development mode and avoid all build issues.

## Option 2: Vercel (Recommended - Easier)

1. **Go to https://vercel.com**
2. **Connect your GitHub repository**
3. **Set environment variables:**
   ```
   NODE_ENV=production
   SESSION_SECRET=coffee-pro-secure-key-2025
   ADMIN_PASSWORD=CoffeePro2025!
   ```
4. **Override build settings:**
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Start Command: `npm start`

## Option 3: Render (Also Easy)

1. **Go to https://render.com**
2. **Connect your GitHub repository**
3. **Create a Web Service**
4. **Set:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. **Add environment variables:**
   ```
   NODE_ENV=production
   SESSION_SECRET=coffee-pro-secure-key-2025
   ADMIN_PASSWORD=CoffeePro2025!
   ```

## Your Coffee Pro Features

Once deployed, your website includes:
- ✅ Complete coffee shop website
- ✅ QR code loyalty system
- ✅ Admin dashboard
- ✅ Customer management
- ✅ Location-based check-ins
- ✅ Marketing contact collection
- ✅ Franchise applications

## Post-Deployment

1. Visit your deployed URL
2. Go to `/admin` to access dashboard
3. Download both QR codes
4. Print and display in your coffee shop

Your Coffee Pro digital platform is ready to serve customers!