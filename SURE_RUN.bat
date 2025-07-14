@echo off
:: مسار Python الصحيح (تعديله حسب جهازك)
set PYTHON="C:\Python39\python.exe"

echo === التحقق من صحة المشروع ===
%PYTHON% manage.py check

echo === تهيئة قاعدة البيانات ===
%PYTHON% manage.py migrate

echo === تشغيل الخادم على منفذ 8012 ===
start %PYTHON% manage.py runserver 8012

echo === انتظر 15 ثانية ===
timeout 15

echo === فتح المتصفح ===
start http://localhost:8012

echo إذا لم يعمل:
echo 1. تأكد من صحة مسار بايثون في الملف
echo 2. تأكد من عدم وجود برامج أخرى تستخدم المنفذ
pause
