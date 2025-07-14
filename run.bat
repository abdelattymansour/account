@echo off
cd /d "%~dp0"
echo جاري تشغيل الخادم...
echo.
node backend/server.js
pause
