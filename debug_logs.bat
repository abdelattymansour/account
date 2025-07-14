@echo off

:: تسجيل وقت البدء
echo === بدء التشغيل في %date% %time% === > debug.log

:: تشغيل الخادم مع تسجيل الأخطاء
python manage.py runserver 8008 2>&1 >> debug.log

:: عرض آخر 10 أسطر من السجل
tail -n 10 debug.log
pause
