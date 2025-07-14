from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from sales.models import Sale
from purchases.models import Purchase
from accounts.models import Customer, Supplier
from products.models import Product

@login_required
def unified_dashboard(request):
    return render(request, 'dashboard/unified.html')

@login_required
def dashboard_view(request):
    return redirect('unified-dashboard')
