#!/bin/bash

# PWA Testing Script
# This script helps you test your PWA setup

echo "🔍 Mining Bot PWA Test Script"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -d "web" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

cd web

echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🏗️  Step 2: Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check the errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🚀 Step 3: Starting production server..."
echo ""
echo "Your app will be available at:"
echo "  → http://localhost:3000"
echo "  → http://localhost:3000/pwa-test.html (PWA test page)"
echo ""
echo "📱 To test on mobile:"
echo "  1. Install ngrok: https://ngrok.com/download"
echo "  2. Run: ngrok http 3000"
echo "  3. Open the HTTPS URL on your phone"
echo ""
echo "🔍 To verify PWA:"
echo "  1. Open Chrome DevTools (F12)"
echo "  2. Go to Application tab"
echo "  3. Check Manifest and Service Workers"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
