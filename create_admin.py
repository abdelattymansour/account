import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mohseb.settings')
import django
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

try:
    if not User.objects.filter(username='admin').exists():
        user = User.objects.create_superuser(
            username='admin',
            password='Admin@1234',
            email='admin@example.com'
        )
        print(f'تم إنشاء الأدمن بنجاح \nاسم المستخدم: admin \nكلمة المرور: Admin@1234')
    else:
        print('حساب الأدمن موجود بالفعل')
except Exception as e:
    print(f'حدث خطأ: {e}')

# إنشاء فئة
from products.models import Category, Unit, Product
from decimal import Decimal

# إنشاء فئة
category, created = Category.objects.get_or_create(
    name='مواد غذائية',
    defaults={'description': 'الأطعمة والمشروبات'}
)

# إنشاء وحدة
unit, created = Unit.objects.get_or_create(
    name='قطعة',
    defaults={'symbol': 'قطعة'}
)

# إنشاء منتج
if not Product.objects.filter(code='PROD001').exists():
    Product.objects.create(
        name='منتج تجريبي',
        code='PROD001',
        category=category,
        unit=unit,
        cost_price=Decimal('10.00'),
        selling_price=Decimal('15.00'),
        min_stock=Decimal('5'),
        current_stock=Decimal('2'),
    )
    print('تم إنشاء منتج تجريبي')

print('تم إنشاء البيانات بنجاح')