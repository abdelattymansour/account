import ExpensesManager from './expenses.js';
import ExportService from './exportService.js';

class AccountingApp {
  constructor() {
    this.expensesManager = new ExpensesManager();
    this.initEventListeners();
    this.loadInitialData();
    this.initNodeRegistration();
    this.loadNodes(); // تحميل النودات عند التشغيل
    this.initReports();
  }

  initEventListeners() {
    // أحداث واجهة المستخدم
    document.getElementById('print-invoice').addEventListener('click', () => {
      ExportService.printElement('invoice-preview');
    });
    
    document.getElementById('export-report').addEventListener('click', async () => {
      const format = document.getElementById('report-format').value;
      const data = this.getReportData();
      
      if (format === 'pdf') {
        await ExportService.exportToPDF('report-content', 'financial-report.pdf');
      } else if (format === 'excel') {
        ExportService.exportToExcel(data, 'financial-report.xlsx');
      } else {
        ExportService.exportToCSV(data, 'financial-report.csv');
      }
    });
  }

  async loadInitialData() {
    try {
      // تحميل البيانات الأولية من API
      const [salesSummary, purchasesSummary, expensesSummary] = await Promise.all([
        this.fetchData('/api/sales/summary'),
        this.fetchData('/api/purchases/summary'),
        this.fetchData('/api/expenses/summary')
      ]);
      
      // عرض لوحة التحكم كصفحة افتراضية
      this.showDashboard(salesSummary, purchasesSummary, expensesSummary);
      
      // تحميل باقي البيانات في الخلفية
      const [customers, products, suppliers] = await Promise.all([
        this.fetchData('/api/customers'),
        this.fetchData('/api/products'),
        this.fetchData('/api/suppliers')
      ]);
      
      this.populateSelect('#customer-select', customers, 'name', 'id');
      this.populateSelect('#supplier-select', suppliers, 'name', 'id');
      this.initProductsGrid(products);
      
      // تحديث لوحة التحكم
      this.updateDashboard();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  async fetchData(endpoint) {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  populateSelect(selector, data, textField, valueField) {
    const select = document.querySelector(selector);
    select.innerHTML = data.map(item => 
      `<option value="${item[valueField]}">${item[textField]}</option>`
    ).join('');
  }

  initProductsGrid(products) {
    const grid = document.querySelector('.products-grid');
    grid.innerHTML = products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}">
        <h5>${product.name}</h5>
        <p>${product.price} ر.س</p>
        <button class="btn btn-sm btn-primary add-to-cart">إضافة</button>
      </div>
    `).join('');
  }

  async updateDashboard() {
    const [sales, purchases, expenses] = await Promise.all([
      this.fetchData('/api/sales/summary'),
      this.fetchData('/api/purchases/summary'),
      this.fetchData('/api/expenses/summary')
    ]);
    
    document.getElementById('total-sales').textContent = sales.total.toFixed(2);
    document.getElementById('total-purchases').textContent = purchases.total.toFixed(2);
    document.getElementById('total-expenses').textContent = expenses.total.toFixed(2);
    document.getElementById('net-profit').textContent = (sales.total - purchases.total - expenses.total).toFixed(2);
    
    this.renderSalesChart(sales.monthly);
  }

  renderSalesChart(monthlyData) {
    const ctx = document.getElementById('sales-chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyData.map(item => item.month),
        datasets: [{
          label: 'المبيعات الشهرية',
          data: monthlyData.map(item => item.amount),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { rtl: true, position: 'top' },
          tooltip: { rtl: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  getReportData() {
    // يمكن تطوير هذه الدالة حسب نوع التقرير المطلوب
    return [
      { التاريخ: '2023-01-01', الوصف: 'فاتورة مبيعات', المبلغ: 1500, النوع: 'دخل' },
      { التاريخ: '2023-01-02', الوصف: 'شراء مخزون', المبلغ: 800, النوع: 'مصروف' },
      // ... بيانات إضافية
    ];
  }

  initNodeRegistration() {
    document.getElementById('register-node').addEventListener('click', async () => {
      const nodeData = {
        nodeId: document.getElementById('node-id').value,
        name: document.getElementById('node-name').value,
        location: document.getElementById('node-location').value
      };

      try {
        const response = await fetch('/api/nodes/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nodeData)
        });
        
        if (response.ok) {
          alert('تم تسجيل النود بنجاح');
        } else {
          throw new Error('فشل في التسجيل');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ أثناء تسجيل النود');
      }
    });
  }

  // تحميل وعرض النودات
  async loadNodes() {
    try {
      const nodes = await this.fetchData('/api/nodes');
      this.renderNodesTable(nodes);
    } catch (error) {
      console.error('Error loading nodes:', error);
    }
  }

  // عرض النودات في جدول
  renderNodesTable(nodes) {
    const table = document.getElementById('nodes-table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>الاسم</th>
          <th>الموقع</th>
          <th>الحالة</th>
          <th>آخر تحديث</th>
          <th>إجراءات</th>
        </tr>
      </thead>
      <tbody>
        ${nodes.map(node => `
          <tr>
            <td>${node.nodeId}</td>
            <td>${node.name}</td>
            <td>${node.location}</td>
            <td>${node.status}</td>
            <td>${new Date(node.updatedAt).toLocaleString()}</td>
            <td>
              <select class="node-status" data-id="${node._id}">
                <option value="active" ${node.status === 'active' ? 'selected' : ''}>نشط</option>
                <option value="inactive" ${node.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
                <option value="maintenance" ${node.status === 'maintenance' ? 'selected' : ''}>صيانة</option>
              </select>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;

    // إضافة مستمعين لأحداث تغيير الحالة
    document.querySelectorAll('.node-status').forEach(select => {
      select.addEventListener('change', async (e) => {
        try {
          await this.updateNodeStatus(e.target.dataset.id, e.target.value);
          this.loadNodes(); // إعادة تحميل البيانات بعد التحديث
        } catch (error) {
          console.error('Error updating node status:', error);
        }
      });
    });
  }

  // تحديث حالة النود
  async updateNodeStatus(nodeId, status) {
    const response = await fetch(`/api/nodes/${nodeId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update node status');
  }

  // تهيئة التقارير
  initReports() {
    document.getElementById('generate-trial-balance').addEventListener('click', async () => {
      const startDate = document.getElementById('tb-start-date').value;
      const endDate = document.getElementById('tb-end-date').value;
      
      try {
        const trialBalance = await this.fetchData(
          `/api/reports/trial-balance?startDate=${startDate || ''}&endDate=${endDate || ''}`
        );
        this.renderTrialBalance(trialBalance);
      } catch (error) {
        console.error('Error generating trial balance:', error);
        alert('حدث خطأ أثناء توليد ميزان المراجعة');
      }
    });
  }

  // عرض ميزان المراجعة
  renderTrialBalance(data) {
    const container = document.getElementById('trial-balance-results');
    
    // عرض الحسابات
    const accountsHtml = data.accounts.map(acc => `
      <tr>
        <td>${acc.code}</td>
        <td>${acc.name}</td>
        <td>${acc.type}</td>
        <td class="text-end">${acc.total_debit.toFixed(2)}</td>
        <td class="text-end">${acc.total_credit.toFixed(2)}</td>
      </tr>
    `).join('');

    // عرض المجاميع
    const totalsHtml = `
      <tr class="table-active">
        <td colspan="3"><strong>المجاميع</strong></td>
        <td class="text-end"><strong>${data.totals.debit.toFixed(2)}</strong></td>
        <td class="text-end"><strong>${data.totals.credit.toFixed(2)}</strong></td>
      </tr>
    `;

    container.innerHTML = `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>كود الحساب</th>
            <th>اسم الحساب</th>
            <th>النوع</th>
            <th class="text-end">مدين</th>
            <th class="text-end">دائن</th>
          </tr>
        </thead>
        <tbody>
          ${accountsHtml}
          ${totalsHtml}
        </tbody>
      </table>
    `;
  }

  showDashboard(salesSummary, purchasesSummary, expensesSummary) {
    document.getElementById('total-sales').textContent = salesSummary.total.toFixed(2);
    document.getElementById('total-purchases').textContent = purchasesSummary.total.toFixed(2);
    document.getElementById('total-expenses').textContent = expensesSummary.total.toFixed(2);
    document.getElementById('net-profit').textContent = (salesSummary.total - purchasesSummary.total - expensesSummary.total).toFixed(2);
  }
}

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  new AccountingApp();
});
