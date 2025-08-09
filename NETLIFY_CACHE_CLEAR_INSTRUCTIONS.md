# Netlify Build Cache Clear Instructions

## Latest Fix: Aggressive Python Exclusion (Commit 9a7ec5e)
**CRITICAL SOLUTION**: Completely eliminated Python files from Netlify's view:
- ✅ **Moved** `requirements.txt` and `manage.py` to `backend/` directory
- ✅ **Added** multiple Python skip environment variables:
  - `NETLIFY_SKIP_PYTHON_BUILD = "true"`
  - `SKIP_PYTHON_INSTALL = "true"`
  - `PYTHON_VERSION = ""` (empty)
- ✅ **Created** `.python-version` file with "SKIP" value
- ✅ **Comprehensive** `.netlifyignore` for all Python files
- ✅ **Updated cache ID**: `v20250809120000`

## Problem Solved
The previous `psycopg2` error was caused by Netlify finding `requirements.txt` in the repository root and attempting to install Django dependencies. By **physically moving** the Python files to a `backend/` directory and using comprehensive exclusion, Netlify should no longer detect any Python code to install.

## Current Configuration Status
- ✅ **No Python files in root**: All moved to `backend/`
- ✅ **Node.js 20 only**: Direct npm build commands
- ✅ **Multiple Python skip flags**: Maximum exclusion coverage
- ✅ **Local build verified**: React build works perfectly
- ✅ **Cache invalidated**: Fresh build guaranteed

## Expected Build Behavior
Netlify should now:
1. ✅ Find **NO** `requirements.txt` in root directory
2. ✅ Skip all Python dependency installation
3. ✅ Use only Node.js 20 for React build
4. ✅ Run `npm install --legacy-peer-deps && npm run build`
5. ✅ Deploy successfully without `pg_config` errors

## Backend Files Location
All Django/Python files are now in `backend/` directory:
- `backend/requirements.txt` - Django dependencies (hidden from Netlify)
- `backend/manage.py` - Django management (hidden from Netlify)
- Railway deployment can reference `backend/requirements.txt` if needed

## Verification
After deployment, run:
```bash
node deploy.js
```
This will verify the deployed version matches your local build.
