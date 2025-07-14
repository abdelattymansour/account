from django.contrib import admin
from .models import Category, Unit, Product, StockMovement

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('name', 'symbol', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'symbol')
    readonly_fields = ('created_at',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'category', 'current_stock', 'stock_status', 'selling_price', 'is_active')
    list_filter = ('category', 'unit', 'product_type', 'is_active', 'track_stock')
    search_fields = ('name', 'code', 'barcode')
    readonly_fields = ('created_at', 'updated_at', 'profit_margin', 'stock_status', 'total_value')
    fieldsets = (
        ('معلومات أساسية', {
            'fields': ('name', 'code', 'barcode', 'category', 'unit', 'product_type', 'description', 'image')
        }),
        ('معلومات الأسعار', {
            'fields': ('cost_price', 'selling_price', 'min_selling_price', 'profit_margin')
        }),
        ('معلومات المخزون', {
            'fields': ('current_stock', 'min_stock', 'max_stock', 'stock_status', 'total_value', 'track_stock', 'allow_negative_stock')
        }),
        ('إعدادات', {
            'fields': ('is_active',)
        }),
        ('تواريخ', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('product', 'movement_type', 'movement_reason', 'quantity', 'stock_before', 'stock_after', 'movement_date', 'created_by')
    list_filter = ('movement_type', 'movement_reason', 'movement_date', 'created_by')
    search_fields = ('product__name', 'product__code', 'reference_number')
    readonly_fields = ('total_cost', 'stock_before', 'stock_after', 'created_at')
    date_hierarchy = 'movement_date'
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
