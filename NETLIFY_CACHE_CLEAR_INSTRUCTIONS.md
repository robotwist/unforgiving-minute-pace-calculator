# Netlify Build Cache Clear Instructions

## Automatic Cache Clear (Recommended)
The latest commit includes a cache ID update in `netlify.toml` which should automatically force a fresh build.

## Manual Cache Clear Options

### Option 1: Netlify Dashboard
1. Go to your Netlify site dashboard
2. Navigate to: **Site Settings** → **Build & Deploy** → **Environment Variables**
3. Add or update: `NETLIFY_CACHE_ID = "v2.1"` (increment the number)
4. Trigger a new deploy

### Option 2: Deploy Settings
1. In your Netlify site dashboard
2. Go to: **Deploys** → **Trigger Deploy** → **Clear Cache and Deploy**
3. This will clear the cache and redeploy

### Option 3: Netlify CLI (if installed)
```bash
netlify build --clear-cache
```

## Current Configuration Status
- ✅ Python version fixed: `python-3.11.9` in `runtime.txt`
- ✅ Environment variables set: `PYTHON_VERSION="3.11.9"`, `NODE_VERSION="20"`
- ✅ Cache ID updated: `NETLIFY_CACHE_ID = "v2.1"` in `netlify.toml`
- ✅ Custom build script: `./build.sh` to avoid Python detection issues

## Expected Build Behavior
With these changes, Netlify should:
1. Use Node.js 20 for the build environment
2. Recognize Python 3.11.9 if needed (but shouldn't be needed for React build)
3. Execute the custom `./build.sh` script that focuses on npm/React build only
4. Generate fresh build artifacts with new hash IDs

## Verification
After deployment, run:
```bash
node deploy.js
```
This will verify the deployed version matches your local build.
