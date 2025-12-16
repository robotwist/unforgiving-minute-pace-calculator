#!/bin/bash
# Bundle Analysis Script
# This script builds and analyzes the bundle sizes

echo "🔍 Starting Bundle Analysis..."
echo ""

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📊 Bundle Size Analysis:"
echo "=========================="
echo ""

# List JS files by size
echo "JavaScript Chunks (largest first):"
ls -lh build/static/js/*.js 2>/dev/null | awk '{printf "%-8s %s\n", $5, $9}' | sort -h -r

echo ""
echo "CSS Files:"
ls -lh build/static/css/*.css 2>/dev/null | awk '{printf "%-8s %s\n", $5, $9}'

echo ""
echo "📈 Total Sizes:"
JS_TOTAL=$(du -ch build/static/js/*.js 2>/dev/null | tail -1 | cut -f1)
CSS_TOTAL=$(du -ch build/static/css/*.css 2>/dev/null | tail -1 | cut -f1)
echo "Total JS: $JS_TOTAL"
echo "Total CSS: $CSS_TOTAL"

echo ""
echo "🎯 To view visual analysis, run:"
echo "   npm run analyze"
echo ""
echo "✅ Analysis complete!"
