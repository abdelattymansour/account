const axios = require('axios');
const API_BASE = 'http://localhost:3000/api';

async function testAccountingSystem() {
  try {
    console.log('جاري اختبار النظام المحاسبي...');
    
    // 1. اختبار الحسابات
    console.log('\n1. اختبار إدارة الحسابات:');
    const newAccount = await axios.post(`${API_BASE}/accounts`, {
      code: '101',
      name: 'الصندوق',
      type: 'asset'
    });
    console.log('- تم إنشاء حساب جديد:', newAccount.data);

    // 2. اختبار اليومية
    console.log('\n2. اختبار القيود اليومية:');
    const journalEntry = await axios.post(`${API_BASE}/journal`, {
      description: 'إيداع نقدي',
      entries: [
        { account_id: newAccount.data.id, debit: 10000, description: 'إيداع في الصندوق' },
        { account_id: 3, credit: 10000, description: 'رأس المال' }
      ]
    });
    console.log('- تم تسجيل القيد:', journalEntry.data);

    // 3. اختبار المخزون
    console.log('\n3. اختبار إدارة المخزون:');
    const product = await axios.post(`${API_BASE}/products`, {
      name: 'منتج اختبار',
      sku: 'TEST-001',
      price: 100,
      cost: 60,
      quantity: 50
    });
    console.log('- تم إضافة منتج:', product.data);

    // 4. اختبار الفواتير
    console.log('\n4. اختبار الفواتير:');
    const invoice = await axios.post(`${API_BASE}/invoices`, {
      customer_id: 1,
      items: [{ product_id: product.data.id, quantity: 5, price: 100 }],
      total: 500
    });
    console.log('- تم إنشاء فاتورة:', invoice.data);

    // 5. اختبار التقارير
    console.log('\n5. اختبار التقارير:');
    const trialBalance = await axios.get(`${API_BASE}/reports/trial-balance`);
    console.log('- ميزان المراجعة:', trialBalance.data.totals);

    console.log('\nتم اختبار جميع الوظائف بنجاح!');
  } catch (error) {
    console.error('\nحدث خطأ أثناء الاختبار:', error.response?.data || error.message);
  }
}

testAccountingSystem();
