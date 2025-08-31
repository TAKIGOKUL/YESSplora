#!/bin/bash

# YESSplora25 Deployment Script - Main Branch Only
echo "🚀 Deploying YESSplora25 from main branch..."

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

# Build the application
echo "📦 Building application from main branch..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful from main branch!"
    
    # Create deployment package (excluding documentation)
    echo "📁 Creating deployment package..."
    tar -czf yessplora25-build.tar.gz \
        --exclude='*.md' \
        --exclude='DEPLOYMENT_GUIDE.md' \
        --exclude='PROJECT_SUMMARY.md' \
        --exclude='README.md' \
        --exclude='.github' \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='src' \
        --exclude='public' \
        --exclude='package.json' \
        --exclude='package-lock.json' \
        --exclude='setup.sh' \
        --exclude='deploy.sh' \
        --exclude='netlify.toml' \
        --exclude='vercel.json' \
        build/
    
    echo "🎉 Deployment package created: yessplora25-build.tar.gz"
    echo "📋 Next steps:"
    echo "   1. Upload the build folder to your hosting platform"
    echo "   2. Configure environment variables"
    echo "   3. Set up HTTPS for camera and location access"
    echo "   4. Test PWA installation on mobile devices"
    echo ""
    echo "✅ Deployed from main branch: $(git rev-parse --short HEAD)"
    
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
