from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('dashboard.urls')),  # جعل هذا المسار الافتراضي
    path('admin/', admin.site.urls),
    path('products/', include('products.urls')),
    # ... باقي المسارات
    path('reports/', include('reports.urls')),
    path('accounts/', include('accounts.urls')),
]
