# Coffee Pro - Database Tables Creation Guide

## Yes, You Need to Create Tables After Railway Deployment

Railway deploys your application but doesn't automatically create database tables. Here's how to set them up:

## Method 1: Using Drizzle-Kit (Recommended)

### Step 1: Access Railway Terminal
1. Go to your Railway project dashboard
2. Click on your **web service** (not the database)
3. Click **"Terminal"** tab
4. Wait for terminal to load

### Step 2: Run Database Migration
In the Railway terminal, execute:
```bash
npm run db:push
```

This command:
- Connects to your PostgreSQL database using DATABASE_URL
- Reads your schema from `shared/schema.ts`
- Creates all required tables automatically

## Method 2: Direct SQL (If drizzle-kit fails)

If Method 1 doesn't work, use the direct migration script:

### In Railway Terminal:
```bash
node migrate.cjs
```

This creates all tables manually using SQL commands.

## Tables That Will Be Created

Your Coffee Pro database needs these 11 tables:
1. **users** - Customer accounts
2. **menu_items** - Menu display items
3. **contact_messages** - Contact form submissions
4. **marketing_contacts** - Newsletter signups
5. **videos** - Video uploads (admin)
6. **loyalty_customers** - QR loyalty program customers
7. **loyalty_visits** - Customer check-in records
8. **loyalty_rewards** - Redeemed rewards tracking
9. **franchise_applications** - Franchise interest forms
10. **qr_tokens** - Secure QR code tokens
11. **user_sessions** - Admin login sessions

## Verification Steps

After running the migration, verify tables exist:

### Check in Railway Terminal:
```bash
psql $DATABASE_URL -c "\dt"
```

This lists all created tables.

### Test Your Live App:
1. Visit your Railway app URL
2. Try admin login at `/admin-dashboard`
3. Test contact form submission
4. Check QR loyalty system at `/loyalty-checkin`

## If Tables Creation Fails

### Common Issues:
- **Database not ready**: Wait 2-3 minutes after PostgreSQL service starts
- **Permission errors**: Ensure DATABASE_URL is correctly linked
- **Connection timeout**: Check PostgreSQL service is running

### Alternative Method:
Use Railway's built-in database query interface:
1. Click on your **PostgreSQL service**
2. Go to **"Query"** tab
3. Run the SQL from `migrate.cjs` manually

## Environment Variables Required

Ensure these are set in your Railway web service:
```
NODE_ENV=production
SESSION_SECRET=a93f9205657eee8e31cfaca6bf94421e22983d52d29e442c645a6146d9de1ed5
ADMIN_PASSWORD=Coffeeproegypt
DATABASE_URL=(automatically linked from PostgreSQL service)
```

## Success Indicators

After successful table creation:
- Admin dashboard login works with password: `Coffeeproegypt`
- Contact forms save to database
- QR loyalty check-ins function properly
- All Coffee Pro features operational

The database tables are essential for your Coffee Pro website to function properly. Run the migration as soon as your Railway deployment completes.