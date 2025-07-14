import os
import sys

def check_server():
    try:
        # التحقق من إعدادات Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mohasseb.settings')
        
        # محاولة استيراد وتشغيل Django
        from django.core.management import execute_from_command_line
        
        print('✔ تم تحميل Django بنجاح')
        
        # محاولة تشغيل الخادم
        print('جارٍ تشغيل الخادم على منفذ 8002...')
        execute_from_command_line(['manage.py', 'runserver', '8002'])
        
    except Exception as e:
        print('✖ حدث خطأ:')
        print(str(e))

if __name__ == '__main__':
    check_server()
