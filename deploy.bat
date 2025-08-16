@echo off
echo 🚀 AI Meeting Notes Summarizer - Deployment Script
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed
echo 📦 Installing server dependencies...

REM Install server dependencies
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

echo ✅ Server dependencies installed
echo 📦 Installing client dependencies...

REM Install client dependencies
cd client
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)

echo ✅ Client dependencies installed
echo 🏗️  Building client application...

REM Build the React app
npm run build

if %errorlevel% neq 0 (
    echo ❌ Failed to build client application
    pause
    exit /b 1
)

echo ✅ Client application built successfully
cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Create a .env file with your configuration:
echo    copy env.example .env
echo    # Edit .env with your Groq API key and email credentials
echo.
echo 2. Start the application:
echo    npm run dev    # Development mode with auto-restart
echo    npm start      # Production mode
echo.
echo 3. Open your browser to:
echo    http://localhost:5000
echo.
echo 📚 For more information, see README.md
echo.
echo 🔑 Don't forget to set up your environment variables!
pause
