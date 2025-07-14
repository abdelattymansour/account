@echo off
cd /d "%~dp0"
echo جاري تثبيت الحزم المطلوبة...
npm install express
npm install sqlite3
npm install mongoose
npm install chart.js
npm install axios
echo.
echo تم التثبيت بنجاح!
echo.
pause
