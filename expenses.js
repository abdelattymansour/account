class ExpensesManager {
  constructor() {
    this.expenses = [];
    this.costCenters = [];
  }

  addExpense(expenseData) {
    // التحقق من صحة البيانات
    if (expenseData.totalAmount <= 0) {
      throw new Error('المبلغ الإجمالي يجب أن يكون موجباً');
    }
    
    const totalDist = expenseData.distribution.reduce((sum, d) => sum + d.amount, 0);
    if (Math.abs(totalDist - expenseData.totalAmount) > 0.01) {
      throw new Error('مجموع التوزيعات يجب أن يساوي المبلغ الإجمالي');
    }

    // إنشاء المصروف
    const expense = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...expenseData,
      distributedAmounts: this.calculateDistribution(expenseData)
    };
    
    this.expenses.push(expense);
    return expense;
  }

  calculateDistribution(expenseData) {
    return expenseData.distribution.map(item => {
      const center = this.costCenters.find(c => c.id === item.centerId);
      return {
        centerId: item.centerId,
        centerName: center ? center.name : '',
        amount: item.amount,
        percentage: (item.amount / expenseData.totalAmount * 100).toFixed(2)
      };
    });
  }

  getExpensesByCenter(centerId) {
    return this.expenses.reduce((total, expense) => {
      const centerExpense = expense.distributedAmounts.find(d => d.centerId === centerId);
      return total + (centerExpense ? parseFloat(centerExpense.amount) : 0);
    }, 0);
  }

  generateReport(options = {}) {
    const { startDate, endDate, centerId } = options;
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new Error('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
    }
    
    let filteredExpenses = [...this.expenses];
    
    if (startDate && endDate) {
      filteredExpenses = filteredExpenses.filter(expense => 
        expense.date >= startDate && expense.date <= endDate
      );
    }
    
    if (centerId) {
      filteredExpenses = filteredExpenses.map(expense => ({
        ...expense,
        distributedAmounts: expense.distributedAmounts.filter(d => d.centerId === centerId)
      })).filter(expense => expense.distributedAmounts.length > 0);
    }
    
    return {
      total: filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.totalAmount), 0),
      count: filteredExpenses.length,
      expenses: filteredExpenses,
      generatedAt: new Date().toISOString()
    };
  }
}

export default ExpensesManager;
