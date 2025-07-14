from django.urls import path
from . import views
from .views import auto_login

app_name = 'accounts'

urlpatterns = [
    path('auto-login/', auto_login, name='auto-login'),
    path('login/', views.custom_login, name='login'),
    path('logout/', views.logout_view, name='logout'),
]
