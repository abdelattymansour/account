@echo off
SET PYTHON_DIR=C:\Program Files\Python39
SET DJANGO_DIR=%~dp0

echo جاري تشغيل الخادم مباشرة...
"%PYTHON_DIR%\python.exe" "%DJANGO_DIR%manage.py" runserver 8010

timeout 5
start http://localhost:8010
pause
