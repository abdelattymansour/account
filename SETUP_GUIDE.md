# دليل إعداد وتشغيل النظام

## متطلبات النظام
1. تثبيت Python 3.9 أو أحدث
2. تثبيت PostgreSQL (اختياري)

## إعداد البيئة

1. استنساخ المستودع:
```
git clone <repo-url>
cd Mohasseb
```

2. إنشاء بيئة افتراضية:
```
python -m venv venv
venv\Scripts\activate
```

3. تثبيت المتطلبات:
```
pip install -r requirements.txt
```

## تشغيل الاختبارات
```
./run_tests.bat
```

## تشغيل الخادم
```
python manage.py runserver
```
