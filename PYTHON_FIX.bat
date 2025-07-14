@echo off
:: === تعليمات مهمة ===
:: 1. استبدل المسار أدناه بمسار python.exe الحقيقي على جهازك
:: 2. تأكد من أن المسار لا يحتوي على مسافات أو أحرف خاصة
:: 3. احفظ الملف بعد التعديل

set PYTHON_PATH="C:\Program Files\Python39\python.exe"

echo === التحقق من وجود Python ===
where python || (
    echo ! خطأ: لم يتم العثور على Python
    echo ! الرجاء تعديل PYTHON_PATH في هذا الملف
    pause
    exit
)

echo === تشغيل الخادم ===
%PYTHON_PATH% manage.py runserver 8016

pause
