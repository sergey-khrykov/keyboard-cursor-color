#!/bin/bash

# Keyboard Cursor Color Extension Installation Script

echo "Installing Keyboard Cursor Color Extension..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Compile the extension
echo "Compiling extension..."
npm run compile

# Check if compilation was successful
if [ $? -eq 0 ]; then
    echo "✅ Extension compiled successfully!"
    echo ""
    echo "To run the extension in development mode:"
    echo "1. Open this folder in VS Code"
    echo "2. Press F5 to launch Extension Development Host"
    echo "3. Test by switching keyboard layouts"
    echo ""
    echo "To package the extension:"
    echo "1. Install vsce: npm install -g vsce"
    echo "2. Package: vsce package"
    echo "3. Install the .vsix file in VS Code"
else
    echo "❌ Compilation failed. Please check the errors above."
    exit 1
fi 