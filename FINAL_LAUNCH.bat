@echo off
:: تغيير المسار حسب موقع بايثون على جهازك
set PYTHON_PATH="C:\Python39\python.exe"

echo جاري التحقق من إعدادات الخادم...
%PYTHON_PATH% manage.py check

echo جاري تشغيل الخادم...
start %PYTHON_PATH% manage.py runserver 8011

timeout 10
start http://localhost:8011
echo إذا لم يفتح المتصفح تلقائياً، يرجى نسخ الرابط أدناه:
echo http://localhost:8011
pause
