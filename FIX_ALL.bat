@echo off
:: الخطوة 1: إيقاف أي عمليات بايثون عالقة
taskkill /F /IM python.exe /T 2>nul

:: الخطوة 2: التحقق من تثبيت بايثون
where python || (
    echo ! خطأ: بايثون غير مثبت
    echo ! الرجاء تثبيت بايثون أولاً من:
    echo ms-windows-store://pdp/?productid=9NJ46SX7X90P
    pause
    exit /b 1
)

:: الخطوة 3: تحديث المتطلبات
python -m pip install -r requirements.txt

:: الخطوة 4: تهيئة قاعدة البيانات
python manage.py migrate

:: الخطوة 5: تشغيل الخادم على منفذ 8020
start python manage.py runserver 8020

:: الخطوة 6: فتح المتصفح بعد 15 ثانية
timeout 15
start http://localhost:8020/admin/
start http://localhost:8020/products/
start http://localhost:8020/expenses/

pause
