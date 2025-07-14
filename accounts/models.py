from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLES = [
        ('ADMIN', 'مدير النظام'),
        ('ACCOUNTANT', 'محاسب'),
        ('SALES', 'مندوب مبيعات'),
    ]
    role = models.CharField(max_length=20, choices=ROLES, default='SALES')
    
    def is_admin(self):
        return self.role == 'ADMIN'
    
    def is_accountant(self):
        return self.role == 'ACCOUNTANT'
    
    USER_ROLES = [
        ('admin', 'مدير'),
        ('employee', 'موظف'),
        ('viewer', 'مشاهد فقط'),
    ]
    
    phone = models.CharField(max_length=20, blank=True, verbose_name='رقم الهاتف')
    position = models.CharField(max_length=100, blank=True, verbose_name='المنصب')
    is_active_employee = models.BooleanField(default=True, verbose_name='موظف نشط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ آخر تحديث')
    
    class Meta:
        verbose_name = 'مستخدم'
        verbose_name_plural = 'المستخدمون'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.get_full_name()} - {self.get_role_display()}"

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    
    def __str__(self):
        return self.name

class Supplier(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    
    def __str__(self):
        return self.name
