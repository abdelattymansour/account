from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import Product, StockMovement

class StockOperationsTest(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name='منتج اختبار',
            code='TEST001',
            cost_price=100,
            selling_price=150,
            current_stock=50
        )
    
    def test_valid_stock_in(self):
        movement = StockMovement.objects.create(
            product=self.product,
            movement_type='in',
            quantity=10,
            unit_cost=100
        )
        self.assertEqual(self.product.current_stock, 60)
    
    def test_invalid_stock_out(self):
        with self.assertRaises(ValidationError):
            StockMovement.objects.create(
                product=self.product,
                movement_type='out',
                quantity=100,  # أكثر من المخزون المتاح
                unit_cost=100
            )
