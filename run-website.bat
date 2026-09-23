@echo off
cd /d "%~dp0"

echo ========================================
echo     KHUSHI BIRTHDAY WEBSITE
echo ========================================
echo.
echo Starting server...
echo.
echo Open this in your browser:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server.
echo.

python server.py

pause