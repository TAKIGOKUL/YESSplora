#!/bin/bash

# YESSplora25 Webapp Deployment Script - Main Branch Only
echo "🚀 Deploying YESSplora25 Webapp from main branch..."

# Ensure we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: Not on main branch (currently on: $CURRENT_BRANCH)"
    echo "🔄 Switching to main branch..."
    git checkout main
    if [ $? -ne 0 ]; then
        echo "❌ Failed to switch to main branch!"
        exit 1
    fi
fi

# Pull latest changes from main
echo "📥 Pulling latest changes from main branch..."
git pull origin main

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the webapp
echo "🏗️  Building webapp..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Webapp build successful!"
    
    # Verify build contents
    echo "📋 Build contents:"
    ls -la build/
    
    # Create webapp-only deployment package
    echo "📁 Creating webapp deployment package..."
    cd build/
    tar -czf ../yessplora25-webapp.tar.gz *
    cd ..
    
    echo "🎉 Webapp deployment package created: yessplora25-webapp.tar.gz"
    echo "📋 Deployment ready:"
    echo "   - Package: yessplora25-webapp.tar.gz"
    echo "   - Size: $(du -h yessplora25-webapp.tar.gz | cut -f1)"
    echo "   - Contents: Webapp files only (no documentation)"
    echo ""
    echo "✅ Webapp deployed from main branch: $(git rev-parse --short HEAD)"
    echo ""
    echo "🌐 To deploy:"
    echo "   1. Extract yessplora25-webapp.tar.gz to your web server"
    echo "   2. Configure HTTPS (required for camera/location)"
    echo "   3. Set up environment variables"
    echo "   4. Test PWA installation on mobile"
    
else
    echo "❌ Webapp build failed! Please check the errors above."
    exit 1
fi
