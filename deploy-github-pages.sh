#!/bin/bash

# YESSplora25 GitHub Pages Manual Deployment Script
echo "🚀 Deploying YESSplora25 to GitHub Pages..."

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

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Clean and install
echo "🧹 Cleaning and installing dependencies..."
rm -rf node_modules package-lock.json
npm install

# Build the application
echo "🏗️  Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if gh-pages branch exists
    if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
        echo "📁 gh-pages branch exists, updating..."
        git checkout gh-pages
        git pull origin gh-pages
    else
        echo "📁 Creating gh-pages branch..."
        git checkout --orphan gh-pages
    fi
    
    # Remove all files except build
    echo "🗑️  Cleaning gh-pages branch..."
    git rm -rf .
    
    # Copy build files
    echo "📋 Copying build files..."
    cp -r build/* .
    
    # Add and commit
    echo "💾 Committing changes..."
    git add .
    git commit -m "🚀 Deploy YESSplora25 v$(node -p "require('./package.json').version) - $(date)"
    
    # Push to gh-pages
    echo "📤 Pushing to gh-pages branch..."
    git push origin gh-pages
    
    # Return to main branch
    git checkout main
    
    echo "🎉 Deployment completed!"
    echo "🌐 Your app should be available at: https://takigokul.github.io/YESSplora"
    echo "⏰ It may take a few minutes for changes to appear."
    
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
