from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q, F, Sum
from django.core.paginator import Paginator
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

from .models import Product, Category, Unit, StockMovement
from .forms import ProductForm, StockMovementForm

@login_required
def product_list(request):
    products = Product.objects.select_related('category', 'unit').filter(is_active=True)
    
    # البحث
    search_query = request.GET.get('search', '')
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(code__icontains=search_query) | 
            Q(barcode__icontains=search_query)
        )
    
    # التصفية حسب الفئة
    category_filter = request.GET.get('category', '')
    if category_filter:
        products = products.filter(category_id=category_filter)
    
    # التصفية حسب حالة المخزون
    stock_filter = request.GET.get('stock_status', '')
    if stock_filter == 'low':
        products = [p for p in products if p.current_stock <= p.min_stock]
    elif stock_filter == 'out':
        products = products.filter(current_stock__lte=0)
    elif stock_filter == 'excess':
        products = [p for p in products if p.current_stock >= p.max_stock]
    
    # الترتيب
    sort_by = request.GET.get('sort', 'name')
    if sort_by in ['name', 'code', 'current_stock', 'selling_price']:
        products = products.order_by(sort_by)
    
    # التصفح المتقدم
    paginator = Paginator(products, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # بيانات للفلاتر
    categories = Category.objects.filter(is_active=True)
    
    context = {
        'products': page_obj,
        'categories': categories,
        'search_query': search_query,
        'category_filter': category_filter,
        'stock_filter': stock_filter,
        'sort_by': sort_by,
    }
    
    return render(request, 'products/product_list.html', context)

@login_required
def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    # آخر حركات المخزون
    recent_movements = StockMovement.objects.filter(product=product).order_by('-movement_date')[:10]
    
    context = {
        'product': product,
        'recent_movements': recent_movements,
    }
    
    return render(request, 'products/product_detail.html', context)

@login_required
def product_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save()
            messages.success(request, f'تم إنشاء المنتج "{product.name}" بنجاح')
            return redirect('products:product_detail', product_id=product.id)
    else:
        form = ProductForm()
    
    return render(request, 'products/product_form.html', {'form': form, 'title': 'إضافة منتج جديد'})

@login_required
def product_update(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            messages.success(request, f'تم تحديث المنتج "{product.name}" بنجاح')
            return redirect('products:product_detail', product_id=product.id)
    else:
        form = ProductForm(instance=product)
    
    return render(request, 'products/product_form.html', {'form': form, 'title': 'تعديل منتج', 'product': product})

@login_required
def stock_movement_create(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        form = StockMovementForm(request.POST)
        if form.is_valid():
            try:
                with transaction.atomic():
                    movement = form.save(commit=False)
                    movement.product = product
                    movement.created_by = request.user
                    movement.movement_date = timezone.now()
                    movement.unit_cost = product.cost_price
                    movement.save()
                    
                    messages.success(request, 'تم تسجيل حركة المخزون بنجاح')
                    return redirect('products:product_detail', product_id=product.id)
                    
            except ValidationError as e:
                messages.error(request, f'خطأ في البيانات: {e}')
            except Exception as e:
                messages.error(request, 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً')
                logger.error(f'Stock movement error: {e}')
    else:
        form = StockMovementForm(initial={
            'unit_cost': product.cost_price,
            'movement_type': 'in'
        })
    
    return render(request, 'products/stock_movement_form.html', 
                 {'form': form, 'product': product})

@login_required
def stock_movements(request):
    movements = StockMovement.objects.select_related('product', 'created_by').order_by('-movement_date')
    
    # البحث
    search_query = request.GET.get('search', '')
    if search_query:
        movements = movements.filter(
            Q(product__name__icontains=search_query) | 
            Q(product__code__icontains=search_query) | 
            Q(reference_number__icontains=search_query)
        )
    
    # التصفية حسب نوع الحركة
    movement_type = request.GET.get('movement_type', '')
    if movement_type:
        movements = movements.filter(movement_type=movement_type)
    
    # التصفية حسب سبب الحركة
    movement_reason = request.GET.get('movement_reason', '')
    if movement_reason:
        movements = movements.filter(movement_reason=movement_reason)
    
    # التصفح المتقدم
    paginator = Paginator(movements, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'movements': page_obj,
        'search_query': search_query,
        'movement_type': movement_type,
        'movement_reason': movement_reason,
    }
    
    return render(request, 'products/stock_movements.html', context)

@login_required
def low_stock_products(request):
    products = Product.objects.filter(
        is_active=True,
        track_stock=True,
        current_stock__lte=F('min_stock')
    ).select_related('category', 'unit')
    
    context = {
        'products': products,
        'title': 'المنتجات ذات المخزون المنخفض'
    }
    
    return render(request, 'products/low_stock_products.html', context)

@login_required
def stock_report(request):
    # إحصائيات المخزون
    total_products = Product.objects.filter(is_active=True).count()
    out_of_stock = Product.objects.filter(is_active=True, current_stock__lte=0).count()
    low_stock = Product.objects.filter(is_active=True, track_stock=True, current_stock__lte=F('min_stock')).count()
    
    # قيمة المخزون الإجمالية
    total_stock_value = Product.objects.filter(is_active=True).aggregate(
        total=Sum(F('current_stock') * F('cost_price'))
    )['total'] or 0
    
    context = {
        'total_products': total_products,
        'out_of_stock': out_of_stock,
        'low_stock': low_stock,
        'total_stock_value': total_stock_value,
    }
    
    return render(request, 'products/stock_report.html', context)
