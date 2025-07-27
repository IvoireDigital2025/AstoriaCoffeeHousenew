# Railway Database Connection Fix

## Problem
The migration script is running during build time when the PostgreSQL database isn't accessible yet.

Error: `getaddrinfo ENOTFOUND postgres.railway.internal`

## Solution
Remove database migration from build process and run it manually after deployment.

## Steps to Fix

### 1. Current Build Configuration (Fixed)
The nixpacks.toml now only:
- Installs dependencies
- Builds the application
- NO database migration during build

### 2. After Railway Deployment Completes
Run database migration manually in Railway terminal:

```bash
npm run db:push
```

OR use the alternative migration script:

```bash
node migrate.cjs
```

### 3. Why This Happens
- During Docker build: Database service isn't accessible
- Railway builds services in isolation
- Database connection only available at runtime

### 4. Environment Variables Required
Make sure these are set in Railway web service:
```
NODE_ENV=production
SESSION_SECRET=a93f9205657eee8e31cfaca6bf94421e22983d52d29e442c645a6146d9de1ed5
ADMIN_PASSWORD=Coffeeproegypt
DATABASE_URL=(auto-linked from PostgreSQL service)
```

### 5. Deployment Flow
1. ✅ Railway builds application (no database access needed)
2. ✅ App starts and connects to database
3. ✅ Manual migration creates tables
4. ✅ All Coffee Pro features work

## Expected Results
- Build completes successfully
- App deploys and runs
- Database migration done post-deployment
- Admin dashboard and all features functional

This separation of build and migration ensures reliable Railway deployment.