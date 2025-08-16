#!/bin/bash

echo "🚀 AI Meeting Notes Summarizer - Deployment Script"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo "📦 Installing server dependencies..."

# Install server dependencies
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

echo "✅ Server dependencies installed"
echo "📦 Installing client dependencies..."

# Install client dependencies
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

echo "✅ Client dependencies installed"
echo "🏗️  Building client application..."

# Build the React app
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build client application"
    exit 1
fi

echo "✅ Client application built successfully"
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Create a .env file with your configuration:"
echo "   cp env.example .env"
echo "   # Edit .env with your Groq API key and email credentials"
echo ""
echo "2. Start the application:"
echo "   npm run dev    # Development mode with auto-restart"
echo "   npm start      # Production mode"
echo ""
echo "3. Open your browser to:"
echo "   http://localhost:5000"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🔑 Don't forget to set up your environment variables!"
