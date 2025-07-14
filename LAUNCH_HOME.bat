@echo off
cd /d "%~dp0"
set PYTHON="C:\Python39\python.exe"
set BASE_URL=http://localhost:8000

%PYTHON% manage.py runserver 8000
timeout 15
start "" "%BASE_URL%/admin"
start "" "%BASE_URL%"
pause
