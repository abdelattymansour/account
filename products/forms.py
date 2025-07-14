from django import forms
from .models import Product, Category, Unit, StockMovement

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = [
            'name', 'code', 'barcode', 'category', 'unit', 'product_type',
            'description', 'image', 'cost_price', 'selling_price', 'min_selling_price',
            'min_stock', 'max_stock', 'track_stock', 'allow_negative_stock', 'is_active'
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'اسم المنتج'}),
            'code': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'كود المنتج'}),
            'barcode': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'الباركود'}),
            'category': forms.Select(attrs={'class': 'form-control'}),
            'unit': forms.Select(attrs={'class': 'form-control'}),
            'product_type': forms.Select(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
            'cost_price': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'selling_price': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'min_selling_price': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'min_stock': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'max_stock': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'track_stock': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'allow_negative_stock': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

class StockMovementForm(forms.ModelForm):
    class Meta:
        model = StockMovement
        fields = [
            'movement_type', 'movement_reason', 'quantity', 'unit_cost',
            'reference_number', 'notes'
        ]
        widgets = {
            'movement_type': forms.Select(attrs={'class': 'form-control'}),
            'movement_reason': forms.Select(attrs={'class': 'form-control'}),
            'quantity': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'unit_cost': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'reference_number': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'رقم المرجع'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'ملاحظات'}),
        }

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'description', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'اسم الفئة'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'وصف الفئة'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

class UnitForm(forms.ModelForm):
    class Meta:
        model = Unit
        fields = ['name', 'symbol', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'اسم الوحدة'}),
            'symbol': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'رمز الوحدة'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
