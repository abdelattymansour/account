@echo off
echo جارٍ البحث عن تثبيتات Python على النظام...

:: قائمة بمسارات بايثون المحتملة
set PYTHON_PATHS=(
    "C:\\Program Files\\Python39\\python.exe"
    "C:\\Program Files\\Python310\\python.exe"
    "%LOCALAPPDATA%\\Programs\\Python\\Python39\\python.exe"
    "%LOCALAPPDATA%\\Programs\\Python\\Python310\\python.exe"
)

:: البحث عن أول مسار صالح
for %%i in %PYTHON_PATHS% do (
    if exist %%i (
        set PYTHON_PATH=%%i
        goto FOUND_PYTHON
    )
)

echo لم يتم العثور على Python! الرجاء تثبيت Python 3.9 أو أحدث
echo أو تعديل ملف RUN_SERVER.bat وإضافة المسار الصحيح
pause
exit

:FOUND_PYTHON
echo تم العثور على Python في: %PYTHON_PATH%

echo جارٍ إنشاء البيئة الافتراضية...
%PYTHON_PATH% -m venv venv
call venv\\Scripts\\activate

echo جارٍ تثبيت المتطلبات...
python -m pip install -r requirements.txt

echo جارٍ تشغيل الخادم...
python manage.py runserver
pause
