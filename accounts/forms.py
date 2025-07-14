from django import forms
from django.contrib.auth.forms import AuthenticationForm

class LoginForm(AuthenticationForm):
    username = forms.CharField(label='اسم المستخدم', widget=forms.TextInput(attrs={'class': 'form-control'}))
    password = forms.CharField(label='كلمة المرور', widget=forms.PasswordInput(attrs={'class': 'form-control'}))
