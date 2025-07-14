from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.unified_dashboard, name='unified-dashboard'),
]
