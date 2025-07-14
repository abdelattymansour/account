@echo off
echo جارٍ التحقق من تثبيت Python...
where python || (
    echo لم يتم العثور على Python!
    echo الرجاء تثبيته من متجر Microsoft أولاً
    pause
    exit
)

echo جارٍ إعداد البيئة...
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

echo جارٍ تشغيل الخادم...
python manage.py runserver 8003
pause
