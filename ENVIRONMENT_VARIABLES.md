# Coffee Pro - Environment Variables for Railway

## Required Environment Variables

### Production Variables for Railway

```bash
# Application Environment
NODE_ENV=production

# Database Connection (Automatically provided by Railway PostgreSQL service)
DATABASE_URL=postgresql://username:password@hostname:port/database

# Session Security
SESSION_SECRET=your-secure-random-string-here-make-it-long-and-complex

# Admin Authentication
ADMIN_PASSWORD=Coffeeproegypt
```

## How to Generate SESSION_SECRET

**Option 1: Use Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Use Online Generator**
- Go to: https://generate-secret.vercel.app/32
- Copy the generated string

**Option 3: Manual Strong Password**
Create a long, random string like:
```
CoffeePro2025SecureSessionKeyForRailwayDeployment123!@#
```

## Environment Variables Setup in Railway

1. Go to your Railway project dashboard
2. Click on your **web service**
3. Click **"Variables"** tab
4. Add each variable:
   - Click **"New Variable"**
   - Enter **Variable Name**
   - Enter **Variable Value**
   - Click **"Add"**

## Important Notes

**DATABASE_URL:**
- Automatically created when you add PostgreSQL service
- No manual configuration needed
- Railway handles internal connection string

**SESSION_SECRET:**
- Must be at least 32 characters long
- Should be random and unique
- Used for securing user sessions

**ADMIN_PASSWORD:**
- Current password: `Coffeeproegypt`
- Used for admin dashboard access
- Can be changed after deployment

## Verification

After setting variables, you should see:
- `NODE_ENV` = production
- `SESSION_SECRET` = your-generated-secret
- `ADMIN_PASSWORD` = Coffeeproegypt
- `DATABASE_URL` = (automatically linked from PostgreSQL service)

All your Coffee Pro features depend on these variables being correctly set.