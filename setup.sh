#!/bin/bash

# YESSplora25 Setup Script
echo "🎮 Setting up YESSplora25 - AR Treasure Hunt Application"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo "📝 Creating .env file..."
        cat > .env << EOF
# YESSplora25 Environment Variables
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
REACT_APP_GOOGLE_SHEETS_ID=1_SVgTT2Fsv2AKGyUfPtQCJiHddvm7keC_yeDBDCEgAE
REACT_APP_APP_NAME=YESSplora25
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
EOF
        echo "✅ .env file created. Please update with your actual API keys."
    fi
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Update .env file with your Google Sheets API key"
    echo "   2. Run 'npm start' to start the development server"
    echo "   3. Open http://localhost:3000 in your browser"
    echo "   4. Test on mobile device for full AR experience"
    echo ""
    echo "🔧 Admin Access:"
    echo "   Username: yessplora25"
    echo "   Password: applejuice"
    echo ""
    echo "📱 PWA Features:"
    echo "   - Installable on mobile devices"
    echo "   - Offline capabilities"
    echo "   - Camera and location access required"
    echo ""
    
else
    echo "❌ Failed to install dependencies. Please check the errors above."
    exit 1
fi
