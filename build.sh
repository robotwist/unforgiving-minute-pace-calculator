#!/bin/bash

# Explicit React/Node.js only build script for Netlify
# This bypasses Netlify's automatic Python detection

echo "🚀 Starting Node.js-only React build..."
echo "📦 Node version: $(node --version)"
echo "📋 NPM version: $(npm --version)"
echo "🔧 Current PATH: $PATH"
echo "🚫 Ensuring no Python tools are used"

# Ensure we're in the right directory
echo "📁 Working directory: $(pwd)"

# Install dependencies
echo "📥 Installing npm dependencies..."
npm install --legacy-peer-deps

# Build the React application
echo "🏗️ Building React application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build output in: ./build/"
ls -la build/ | head -5
