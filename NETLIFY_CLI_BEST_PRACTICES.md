# Netlify CLI Best Practices

## Overview

Using Netlify CLI gives you direct control over deployments, settings, and build configuration. This guide outlines best practices for managing your Netlify site via CLI.

## Current Status

- **Netlify CLI**: ✅ Installed (v23.1.4)
- **Site**: Connected via Git (auto-deploy from GitHub)
- **Configuration**: Managed via `netlify.toml`

## Best Practices

### 1. **Link Your Site**

First, link your local repository to your Netlify site:

```bash
netlify link
```

This will:
- Prompt you to authenticate (if not already)
- Let you choose from existing sites or create a new one
- Create a `.netlify/state.json` file with site ID (should be gitignored)

**Benefits:**
- Enables CLI commands to target your specific site
- Allows manual deployments: `netlify deploy`
- Better debugging and status checks

### 2. **Verify Settings Match**

After linking, verify your settings:

```bash
# Check current site configuration
netlify status

# View all settings
netlify sites:list

# Get detailed site info
netlify api getSite --data '{"site_id": "YOUR_SITE_ID"}'
```

### 3. **Deployment Workflow Options**

#### Option A: Git-Based Auto-Deploy (Current - Recommended)
- ✅ Push to GitHub → Netlify automatically builds
- ✅ Works well for team collaboration
- ✅ Version control integration
- ✅ Automatic from any branch push

#### Option B: CLI Manual Deploy (Useful for testing)
```bash
# Build and deploy to draft URL (for preview)
netlify deploy

# Deploy to production
netlify deploy --prod
```

**Use CLI deploys for:**
- Testing builds before pushing to main
- Quick fixes that need immediate deployment
- Debugging build issues locally

### 4. **Managing Build Settings**

#### View Current Build Settings
```bash
netlify build:list
```

#### Sync Settings from netlify.toml
Your `netlify.toml` should be the source of truth. Verify it matches:

```bash
# View what Netlify sees
netlify status
```

#### Update Settings via CLI (if needed)
```bash
# Set build command
netlify build:settings:set --command "npm run build"

# Set publish directory
netlify build:settings:set --dir "build"

# Set environment variables
netlify env:set KEY_NAME "value"
```

**Best Practice:** Keep all settings in `netlify.toml` and avoid CLI changes unless debugging.

### 5. **Environment Variables**

#### View All Environment Variables
```bash
netlify env:list
```

#### Set Environment Variable
```bash
netlify env:set VARIABLE_NAME "value"
```

#### Set for Specific Context
```bash
netlify env:set VARIABLE_NAME "value" --context production
netlify env:set VARIABLE_NAME "value" --context deploy-preview
```

#### Import from File
```bash
netlify env:import .env.production
```

**Best Practice:**
- Use `netlify env:set` for secrets (not committed to git)
- Keep non-sensitive defaults in `netlify.toml` under `[build.environment]`
- Document required env vars in README

### 6. **Debugging Build Issues**

#### Test Build Locally
```bash
# Install dependencies
npm install

# Run build command (same as Netlify)
netlify build

# Or just test the build locally
npm run build
```

#### View Build Logs
```bash
# List recent builds
netlify builds:list

# View specific build log
netlify builds:log BUILD_ID

# Watch live build
netlify watch
```

#### Clear Cache
```bash
# Trigger rebuild with cleared cache
netlify deploy --prod --clear-cache

# Or update NETLIFY_CACHE_ID in netlify.toml
```

### 7. **Deploy Preview Management**

#### Create Deploy Preview
```bash
netlify deploy
# Returns draft URL for preview
```

#### List Deploy Previews
```bash
netlify deploy:list
```

#### Promote Deploy Preview to Production
```bash
netlify deploy:alias PRODUCTION_URL --deploy-id DEPLOY_ID
```

### 8. **Functions (if using Netlify Functions)**

```bash
# Test function locally
netlify dev

# List functions
netlify functions:list

# Invoke function
netlify functions:invoke FUNCTION_NAME
```

### 9. **Performance & Analytics**

```bash
# View site analytics
netlify status

# Check build time analytics (in Netlify dashboard)
# CLI doesn't have direct analytics commands
```

### 10. **Configuration File Best Practices**

Your `netlify.toml` should be the **single source of truth**:

```toml
[build]
  base = "."
  publish = "build"
  command = "npm ci --legacy-peer-deps --production=false && npm run build"
  # Use ignore command carefully - can cause issues if too aggressive
  # ignore = "git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF src/ public/ package.json package-lock.json"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"
  CI = "true"
  NODE_ENV = "production"
  # Cache ID helps force cache invalidation when needed
  NETLIFY_CACHE_ID = "v20251211_pr_calculator_v2"

# Context-specific settings
[context.production]
  command = "npm install --legacy-peer-deps && npm run build"

# Redirects
[[redirects]]
  from = "/api/*"
  to = "https://your-api-url.com/api/:splat"
  status = 200

# Headers for security and performance
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    # ... other headers
```

**Best Practices:**
- ✅ Keep all build configuration in `netlify.toml`
- ✅ Version control this file
- ✅ Use environment-specific contexts
- ✅ Document any non-standard settings
- ⚠️ Be careful with `ignore` command - can prevent valid builds

### 11. **Troubleshooting Common Issues**

#### Build Skipped Due to "No Content Change"

**Problem:** Netlify skips build even when code changed.

**Solutions:**
1. Temporarily disable ignore command in `netlify.toml`
2. Update `NETLIFY_CACHE_ID` to force cache refresh
3. Use `netlify deploy --prod` to force deploy
4. Check if git diff is working: `git diff HEAD~1 HEAD src/`

#### Build Fails with Cache Issues

```bash
# Clear cache and rebuild
netlify deploy --prod --clear-cache

# Or update cache ID in netlify.toml
NETLIFY_CACHE_ID = "new_unique_id"
```

#### Environment Variables Not Available

```bash
# Verify variables are set
netlify env:list

# Re-set if needed
netlify env:set VAR_NAME "value" --context production
```

### 12. **Recommended Workflow**

#### For Regular Development:
```bash
# 1. Make changes locally
# 2. Test build
npm run build

# 3. Commit and push (triggers auto-deploy)
git add .
git commit -m "Description"
git push origin main

# 4. Verify deployment (optional)
netlify status
```

#### For Quick Fixes:
```bash
# 1. Make changes
# 2. Test build
npm run build

# 3. Deploy directly via CLI
netlify deploy --prod

# 4. Commit afterward
git add .
git commit -m "Quick fix"
git push origin main
```

#### For Debugging Build Issues:
```bash
# 1. Link site (if not already)
netlify link

# 2. View recent builds
netlify builds:list

# 3. View build logs
netlify builds:log BUILD_ID

# 4. Test build locally
netlify build

# 5. Deploy with cleared cache if needed
netlify deploy --prod --clear-cache
```

### 13. **Git Integration Best Practices**

**Current Setup (Recommended):**
- ✅ Auto-deploy from GitHub main branch
- ✅ Build on every push
- ✅ Deploy previews for PRs (if enabled)

**Optional Enhancements:**
```bash
# Enable deploy previews for all branches
# (Configure in Netlify dashboard: Site settings → Build & deploy → Deploy contexts)

# Enable branch deploys for staging
# (Create branch subdomain in Netlify dashboard)
```

### 14. **Security Considerations**

1. **Never commit `.netlify/state.json`** - Contains site access tokens
   ```bash
   # Add to .gitignore
   echo ".netlify/" >> .gitignore
   ```

2. **Use environment variables for secrets:**
   ```bash
   netlify env:set SECRET_KEY "value" --context production
   ```

3. **Rotate tokens if compromised:**
   ```bash
   # Re-authenticate
   netlify logout
   netlify login
   ```

### 15. **Quick Reference Commands**

```bash
# Authentication
netlify login
netlify logout

# Site Management
netlify link                    # Link local repo to Netlify site
netlify status                  # Show site status
netlify sites:list              # List all sites

# Deployment
netlify deploy                  # Deploy to draft URL
netlify deploy --prod           # Deploy to production
netlify deploy --prod --clear-cache  # Deploy with cleared cache

# Build Management
netlify build                   # Run build locally
netlify builds:list             # List builds
netlify builds:log BUILD_ID     # View build logs
netlify watch                   # Watch for changes and rebuild

# Environment Variables
netlify env:list                # List all env vars
netlify env:set KEY "value"     # Set env var
netlify env:get KEY             # Get env var value
netlify env:unset KEY           # Remove env var
netlify env:import .env         # Import from file

# Configuration
netlify build:settings:set      # Update build settings
netlify open:admin              # Open Netlify dashboard
netlify open:site               # Open live site

# Debugging
netlify logs                    # View function logs
netlify functions:list          # List functions
```

## Recommended Next Steps

1. **Link your site:**
   ```bash
   netlify link
   ```

2. **Verify current settings:**
   ```bash
   netlify status
   ```

3. **Test a manual deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Set up proper .gitignore:**
   ```bash
   echo ".netlify/" >> .gitignore
   git add .gitignore
   git commit -m "Ignore Netlify CLI state files"
   ```

5. **Document required environment variables:**
   - List them in README.md
   - Set them via `netlify env:set` or Netlify dashboard

## Current Configuration Summary

Your current `netlify.toml` includes:
- ✅ Build command with legacy peer deps
- ✅ Node version 18
- ✅ Cache ID for cache management
- ✅ API redirects
- ✅ Security headers
- ⚠️ Ignore command (currently disabled - re-enable when build issues resolved)

**Recommendation:** Keep using Git-based auto-deploy as primary method, but use CLI for debugging and quick fixes.
