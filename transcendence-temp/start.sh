#!/bin/bash

echo "🏓 Starting Babylon.js Ping Pong Game 🏓"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server && npm install && cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client && npm install && cd ..

echo "✅ Dependencies installed successfully!"
echo ""
echo "🚀 Starting development servers..."
echo "   - Server: http://localhost:3001"
echo "   - Client: http://localhost:3000"
echo ""
echo "🎮 To play:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Open a second browser window/tab for the second player"
echo "   3. Enjoy the game!"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Start development servers
npm run dev 