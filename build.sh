#!/bin/bash

# Explicit React/Node.js only build script for Netlify
# This bypasses Netlify's automatic Python detection

echo "🚀 Starting Node.js-only React build..."
echo "📦 Node version: $(node --version)"
echo "📋 NPM version: $(npm --version)"

# Install dependencies
echo "📥 Installing npm dependencies..."
npm install --legacy-peer-deps

# Build the React application
echo "🏗️ Building React application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build output in: ./build/"
ls -la build/ | head -5
