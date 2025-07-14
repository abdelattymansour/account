from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.core.exceptions import ValidationError

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name='اسم الفئة')
    description = models.TextField(blank=True, verbose_name='الوصف')
    is_active = models.BooleanField(default=True, verbose_name='نشط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ التحديث')
    
    class Meta:
        verbose_name = 'فئة المنتج'
        verbose_name_plural = 'فئات المنتجات'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Unit(models.Model):
    name = models.CharField(max_length=50, verbose_name='اسم الوحدة')
    symbol = models.CharField(max_length=10, verbose_name='رمز الوحدة')
    is_active = models.BooleanField(default=True, verbose_name='نشط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    
    class Meta:
        verbose_name = 'وحدة القياس'
        verbose_name_plural = 'وحدات القياس'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.symbol})"

class Product(models.Model):
    PRODUCT_TYPES = [
        ('product', 'منتج'),
        ('service', 'خدمة'),
        ('raw_material', 'مادة خام'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='اسم المنتج')
    code = models.CharField(max_length=50, unique=True, verbose_name='كود المنتج')
    barcode = models.CharField(max_length=50, blank=True, verbose_name='الباركود')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, verbose_name='الفئة')
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT, verbose_name='الوحدة')
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES, default='product', verbose_name='نوع المنتج')
    
    # معلومات المنتج
    description = models.TextField(blank=True, verbose_name='الوصف')
    image = models.ImageField(upload_to='products/', blank=True, verbose_name='صورة المنتج')
    
    # معلومات الأسعار
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))], verbose_name='سعر التكلفة')
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))], verbose_name='سعر البيع')
    min_selling_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name='أقل سعر بيع')
    
    # معلومات المخزون
    current_stock = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='المخزون الحالي')
    min_stock = models.PositiveIntegerField(default=10, verbose_name='الحد الأدنى للمخزون')
    max_stock = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='الحد الأقصى للمخزون')
    
    # إعدادات المنتج
    track_stock = models.BooleanField(default=True, verbose_name='تتبع المخزون')
    is_active = models.BooleanField(default=True, verbose_name='نشط')
    allow_negative_stock = models.BooleanField(default=False, verbose_name='السماح بالمخزون السالب')
    
    # تواريخ
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ التحديث')
    
    class Meta:
        verbose_name = 'منتج'
        verbose_name_plural = 'المنتجات'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.code}"
    
    def clean(self):
        # التحقق من أن سعر البيع أكبر من سعر التكلفة
        if self.selling_price < self.cost_price:
            raise ValidationError('سعر البيع يجب أن يكون أكبر من سعر التكلفة')
            
        # التحقق من الحد الأدنى للبيع
        if self.min_selling_price and self.min_selling_price > self.selling_price:
            raise ValidationError('الحد الأدنى لسعر البيع لا يمكن أن يكون أكبر من سعر البيع')
    
    @property
    def profit_margin(self):
        if self.cost_price and self.selling_price:
            return ((self.selling_price - self.cost_price) / self.cost_price) * 100
        return 0
    
    @property
    def stock_status(self):
        if not self.track_stock:
            return 'لا يتم تتبعه'
        elif self.current_stock <= 0:
            return 'نفد المخزون'
        elif self.current_stock <= self.min_stock:
            return 'مخزون منخفض'
        elif self.current_stock >= self.max_stock:
            return 'مخزون زائد'
        else:
            return 'طبيعي'
    
    @property
    def total_value(self):
        return self.current_stock * self.cost_price
    
    @property
    def low_stock_alert(self):
        return self.current_stock < self.min_stock
    
    def save(self, *args, **kwargs):
        if self.low_stock_alert:
            print(f'تنبيه: مخزون {self.name} منخفض!')
        super().save(*args, **kwargs)

class StockMovement(models.Model):
    MOVEMENT_TYPES = [
        ('in', 'دخول'),
        ('out', 'خروج'),
        ('adjustment', 'تعديل'),
        ('transfer', 'نقل'),
    ]
    
    MOVEMENT_REASONS = [
        ('purchase', 'شراء'),
        ('sale', 'بيع'),
        ('return_in', 'مرتجع شراء'),
        ('return_out', 'مرتجع بيع'),
        ('adjustment', 'تعديل مخزون'),
        ('damage', 'تلف'),
        ('expired', 'انتهاء صلاحية'),
        ('transfer', 'نقل'),
        ('opening_balance', 'رصيد افتتاحي'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name='المنتج')
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES, verbose_name='نوع الحركة')
    movement_reason = models.CharField(max_length=20, choices=MOVEMENT_REASONS, verbose_name='سبب الحركة')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='الكمية')
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='سعر الوحدة')
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='إجمالي التكلفة')
    
    # معلومات إضافية
    reference_number = models.CharField(max_length=50, blank=True, verbose_name='رقم المرجع')
    notes = models.TextField(blank=True, verbose_name='ملاحظات')
    
    # المخزون قبل وبعد الحركة
    stock_before = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='المخزون قبل الحركة')
    stock_after = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='المخزون بعد الحركة')
    
    # تواريخ
    movement_date = models.DateTimeField(verbose_name='تاريخ الحركة')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    created_by = models.ForeignKey('accounts.User', on_delete=models.PROTECT, verbose_name='المنشئ')
    
    class Meta:
        verbose_name = 'حركة مخزون'
        verbose_name_plural = 'حركات المخزون'
        ordering = ['-movement_date']
    
    def __str__(self):
        return f"{self.product.name} - {self.get_movement_type_display()} - {self.quantity}"
    
    def clean(self):
        if not self.product.allow_negative_stock and self.movement_type == 'out':
            if self.quantity > self.product.current_stock:
                raise ValidationError('لا يمكن صرف كمية أكبر من المخزون المتاح')
        
        if self.unit_cost <= 0:
            raise ValidationError('سعر الوحدة يجب أن يكون قيمة موجبة')
    
    def save(self, *args, **kwargs):
        self.full_clean()
        
        # حساب القيم التلقائية
        self.total_cost = self.quantity * self.unit_cost
        self.stock_before = self.product.current_stock
        
        # تحديث المخزون
        if self.movement_type == 'in':
            self.product.current_stock += self.quantity
        elif self.movement_type == 'out':
            self.product.current_stock -= self.quantity
            
        self.stock_after = self.product.current_stock
        
        # حفظ المنتج أولاً
        self.product.save()
        
        # ثم حفظ حركة المخزون
        super().save(*args, **kwargs)
