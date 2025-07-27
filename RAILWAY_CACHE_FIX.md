# Railway Cache Issue Fix

## Problem
Railway's Docker build is failing due to npm cache conflicts:
```
EBUSY: resource busy or locked, rmdir '/app/node_modules/.cache'
```

## Solutions Applied

### 1. Updated nixpacks.toml
- Changed `npm ci` to `npm install --no-cache --prefer-offline`
- Added custom NPM cache directory: `/tmp/.npm`
- Specified Node.js version 18 for stability

### 2. Created .railwayignore
- Excludes unnecessary files from deployment
- Reduces build size and potential conflicts
- Excludes large media files from attached_assets

### 3. Alternative Deployment Methods

If cache issues persist, try these Railway workarounds:

#### Option A: Manual Build Commands
In Railway dashboard → Service Settings → Build:
```bash
npm install --no-cache && npm run db:push && npm run build
```

#### Option B: Clear Railway Cache
1. Go to Railway project settings
2. Click "Clear Build Cache"
3. Redeploy the project

#### Option C: Use Alternative Build Script
Create custom build in package.json:
```json
"railway-build": "rm -rf node_modules/.cache && npm install && npm run db:push && npm run build"
```

### 4. Environment Variables for Cache Fix
Add these to Railway variables:
```
NPM_CONFIG_CACHE=/tmp/.npm
NODE_OPTIONS=--max-old-space-size=4096
```

## Why This Happens
- Railway uses Docker with mounted cache volumes
- npm cache can become locked between builds
- Node.js memory issues during large builds

## Expected Results
With these fixes:
- Build should complete successfully
- Database migration runs properly
- All Coffee Pro features work on deployment

If issues persist, Railway support is very responsive to build cache problems.