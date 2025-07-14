@echo off
echo === إعداد البيئة التشغيلية ===
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

echo === تشغيل الخادم ===
python manage.py migrate
python manage.py runserver 8006

start http://localhost:8006
