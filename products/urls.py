from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    # قائمة المنتجات
    path('', views.product_list, name='product_list'),
    path('create/', views.product_create, name='product_create'),
    path('<int:product_id>/', views.product_detail, name='product_detail'),
    path('<int:product_id>/edit/', views.product_update, name='product_update'),
    
    # حركات المخزون
    path('<int:product_id>/stock-movement/', views.stock_movement_create, name='stock_movement_create'),
    path('stock-movements/', views.stock_movements, name='stock_movements'),
    
    # تقارير المخزون
    path('low-stock/', views.low_stock_products, name='low_stock_products'),
    path('stock-report/', views.stock_report, name='stock_report'),
]
