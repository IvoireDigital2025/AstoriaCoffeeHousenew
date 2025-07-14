# Coffee Pro - Digital Platform

A comprehensive digital platform for Coffee Pro in Astoria, NY featuring QR code loyalty system, customer management, and location-based check-ins.

## Features

- QR code loyalty program with location validation
- Customer check-in system with 5-point rewards
- Admin dashboard for customer and franchise management
- Menu display with authentic Coffee Pro items
- Marketing contact collection
- SEO optimized for local search

## Railway Deployment

### Prerequisites
1. Create a Railway account at [railway.app](https://railway.app)
2. Install Railway CLI: `npm install -g @railway/cli`

### Environment Variables
Set these environment variables in Railway:

```
DATABASE_URL=postgresql://username:password@hostname:port/database
SESSION_SECRET=your-secure-session-secret-key
NODE_ENV=production
ADMIN_PASSWORD=your-admin-password
```

### Deployment Steps

1. **Connect to Railway**:
   ```bash
   railway login
   ```

2. **Create a new project**:
   ```bash
   railway new
   ```

3. **Add PostgreSQL database**:
   ```bash
   railway add postgresql
   ```

4. **Deploy the application**:
   ```bash
   railway up
   ```

5. **Set environment variables**:
   ```bash
   railway variables set SESSION_SECRET=your-secure-key
   railway variables set ADMIN_PASSWORD=your-admin-password
   ```

6. **Run database migrations**:
   ```bash
   railway run npm run db:push
   ```

### Post-Deployment

1. **Access admin dashboard**: `your-domain.railway.app/admin`
2. **Download QR codes** for loyalty program and website access
3. **Print and display QR codes** in your Coffee Pro store

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

## Store Information

- **Location**: 23-33 Astoria Blvd, Astoria, NY 11102
- **Phone**: (347) 329-6816
- **Email**: Coffeepro23@gmail.com
- **Hours**: 
  - Sunday-Thursday: 7:00 AM - 7:30 PM
  - Friday-Saturday: 7:00 AM - 8:30 PM

## QR Code System

- **Loyalty QR**: Customers scan to check-in and earn points
- **Website QR**: Customers scan to access the website
- **Location validation**: 100m radius from store location
- **Time window**: 60 seconds to complete check-in after scan

## Technology Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: Express sessions
- **QR Codes**: qrcode library
- **Deployment**: Railway