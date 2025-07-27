# Missing Environment Variable Fix

## Problem Identified
The error `TypeError [ERR_INVALID_ARG_TYPE]: The "paths[0]" argument must be of type string. Received undefined` indicates a missing environment variable that should contain a file path.

## Add This Missing Variable to Railway

Add this additional environment variable in Railway:

```
CLIENT_BUILD_PATH=/app/dist/client
```

## Complete Environment Variables List

Make sure ALL these variables are set in Railway:

```
NODE_ENV=production
SESSION_SECRET=a93f9205657eee8e31cfaca6bf94421e22983d52d29e442c645a6146d9de1ed5
ADMIN_PASSWORD=Coffeeproegypt
NODE_OPTIONS=--max-old-space-size=4096
COFFEE_SHOP_LAT=40.7614
COFFEE_SHOP_LON=-73.9776
CLIENT_BUILD_PATH=/app/dist/client
```

## Why This Variable Is Needed

The server is trying to resolve a path for serving static files, but the environment variable containing the build path is undefined. The CLIENT_BUILD_PATH variable provides a fallback location for the client build files.

## Alternative Fix

If CLIENT_BUILD_PATH doesn't solve it, the production server now has robust fallback logic that checks multiple possible locations for the client files automatically.

The enhanced production server will:
1. Check multiple common build directory locations
2. Use the first valid path it finds
3. Provide clear error messages if no build directory is found
4. Handle the path resolution without requiring undefined variables

This ensures your Coffee Pro application starts successfully even if some environment variables are missing.