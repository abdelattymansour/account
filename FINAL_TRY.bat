@echo off
:: تغيير هذا المسار حسب موقع python.exe على جهازك
set PYTHON="C:\Python39\python.exe"

echo === تنظيف البيئة ===
taskkill /F /IM python.exe /T 2>nul

echo === التحقق من إعدادات المشروع ===
%PYTHON% manage.py check

echo === تهيئة قاعدة البيانات ===
%PYTHON% manage.py migrate

echo === تشغيل الخادم على منفذ 8014 ===
start %PYTHON% manage.py runserver 8014 --noreload

echo === انتظر 20 ثانية ===
timeout 20

echo === فتح المتصفح ===
start http://localhost:8014

pause
