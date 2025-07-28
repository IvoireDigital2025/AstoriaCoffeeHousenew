# Railway Database Connection Fix

## Problem
Railway deployment shows WebSocket connection errors when trying to connect to PostgreSQL database:
```
connect ECONNREFUSED fd12:924c:af4:0:a000:3d:1766:37d8:443
WebSocket connection to 'wss://postgres.railway.internal/v2' failed
```

## Root Cause
The application was using Neon serverless WebSocket connections (`@neondatabase/serverless`) which are incompatible with Railway's standard PostgreSQL service. Railway provides regular PostgreSQL databases, not Neon serverless instances.

## Fix Applied

### 1. Switched from Neon to Standard PostgreSQL
**Before (Neon Serverless):**
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;
```

**After (Standard PostgreSQL):**
```typescript
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

### 2. Enhanced Connection Configuration
- Increased connection timeout to 30 seconds for Railway's network
- Added proper SSL configuration for production environment
- Set connection pool size to 10 for better performance
- Removed WebSocket-specific configurations

## Why This Fix Works
- **Railway Compatibility**: Uses standard `pg` driver that Railway PostgreSQL supports natively
- **No WebSockets**: Eliminates WebSocket connection attempts that fail on Railway
- **Proper SSL**: Configures SSL correctly for Railway's PostgreSQL service
- **Connection Pooling**: Optimized for Railway's connection limits

## Expected Results
After pushing these changes:
- ✅ Newsletter subscription will work without database errors
- ✅ All forms (contact, franchise, loyalty) will submit successfully
- ✅ Admin dashboard will load and save data properly
- ✅ No more `ECONNREFUSED` or WebSocket connection errors

The standard PostgreSQL connection is more reliable and compatible with Railway's infrastructure than Neon serverless connections.