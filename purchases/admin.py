from django.contrib import admin
from .models import Purchase

# Register your models here.

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'supplier', 'product', 'quantity', 'price', 'date')
    list_filter = ('date', 'supplier')
    search_fields = ('supplier__name', 'product__name')
