# Railway SIGTERM and NPM Warning Fix

## Problems Identified
1. **NPM Warning**: `npm warn config production Use --omit=dev instead`
2. **Container Stopping**: Railway container exits with SIGTERM after successful startup
3. **Wrong Start Command**: Using `tsx server/railway-production.js` instead of proper start script

## Root Causes
- Railway was using deprecated npm flags during build process
- Container wasn't handling SIGTERM signals gracefully
- Start command pointed to wrong file causing npm process conflicts

## Comprehensive Fix Applied

### 1. Updated Start Process (start.js)
**Enhanced Features:**
- **Signal Handling**: Proper SIGTERM and SIGINT handling for graceful shutdowns
- **Environment Setup**: Explicit NODE_ENV=production to prevent npm warnings
- **Server Fallback**: Tries multiple server files in order of preference
- **Error Recovery**: Robust error handling with detailed logging

### 2. Fixed Build Configuration (nixpacks.toml)
**Before:**
```toml
[phases.build]
cmds = [
  "npm install --no-cache --prefer-offline",
  "npm run build"
]

[phases.start]
cmd = "npm start"
```

**After:**
```toml
[phases.build]
cmds = [
  "npm install --no-cache --prefer-offline --omit=dev",
  "npm install --no-cache --prefer-offline --include=dev", 
  "npm run build"
]

[phases.start]
cmd = "node start.js"
```

### 3. Updated Railway Deployment (railway.json)
**Before:**
```json
"startCommand": "npx tsx server/railway-production.js"
```

**After:**
```json
"startCommand": "node start.js"
```

### 4. Server Priority Order
The start.js now tries servers in this order:
1. `./server/railway-production.js` (Railway-optimized)
2. `./server/production.js` (General production)
3. `./dist/index.js` (Built server)

## Expected Results After Push
- ✅ No more npm deprecation warnings
- ✅ Clean Railway deployment without SIGTERM issues
- ✅ Proper graceful shutdown handling
- ✅ Stable container execution without early termination
- ✅ All Coffee Pro features working correctly

## Deployment Process
1. Push these changes to your GitHub repository
2. Railway will automatically detect and redeploy
3. Monitor deployment logs for clean startup without warnings
4. Verify admin dashboard and all forms work correctly

This fix ensures Railway deployment follows modern Node.js best practices while maintaining full Coffee Pro functionality.