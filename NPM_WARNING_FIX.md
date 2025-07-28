# NPM Production Warning Fix

## Problem
NPM shows deprecation warning during Railway deployment:
```
npm warn config production Use `--omit=dev` instead.
```

## Root Cause
The warning occurs because npm is using the deprecated `--production` flag instead of the modern `--omit=dev` flag for excluding development dependencies during build.

## Fix Applied

### Updated Nixpacks Configuration (nixpacks.toml)
**Before:**
```toml
[phases.build]
cmds = [
  "npm install --no-cache --prefer-offline",
  "npm run build"
]
```

**After:**
```toml
[phases.build]
cmds = [
  "npm install --no-cache --prefer-offline --omit=dev",
  "npm install --no-cache --prefer-offline --include=dev", 
  "npm run build"
]
```

### Why This Fix Works
- **Modern Syntax**: Uses `--omit=dev` instead of deprecated `--production` flag
- **Complete Dependencies**: First installs production dependencies, then dev dependencies for build
- **Clean Build**: Eliminates the npm warning while maintaining proper dependency management

## Expected Results
After pushing to Railway:
- ✅ No more "Use --omit=dev instead" warnings
- ✅ All dependencies properly installed for build process
- ✅ Clean deployment logs without deprecation warnings
- ✅ Same functionality with modern npm practices

This fix ensures Railway uses current npm best practices while maintaining full compatibility with the Coffee Pro build process.