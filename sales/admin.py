from django.contrib import admin
from .models import Sale

# Register your models here.

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'product', 'quantity', 'price', 'date')
    list_filter = ('date', 'customer')
    search_fields = ('customer__name', 'product__name')
