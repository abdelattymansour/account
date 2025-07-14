@echo off

:: تحديد مسار Python الافتراضي
set PYTHON_PATH=C:\Python39\python.exe

:: التحقق من وجود Python
if not exist "%PYTHON_PATH%" (
   echo ! خطأ: لم يتم العثور على Python في المسار المحدد
   echo ! الرجاء تعديل PYTHON_PATH في هذا الملف
   pause
   exit
)

echo جارٍ تشغيل البرنامج...
"%PYTHON_PATH%" manage.py runserver 8007

start http://localhost:8007
pause
