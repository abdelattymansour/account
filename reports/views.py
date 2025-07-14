from django.shortcuts import render
from sales.models import Sale
import json

def report_list(request):
    return render(request, 'reports/report_list.html')

def sales_report(request):
    sales = Sale.objects.all()
    # معالجة البيانات للرسوم البيانية
    return render(request, 'reports/charts.html')
