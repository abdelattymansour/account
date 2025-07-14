const express = require('express');
const { db, initializeDatabase } = require('./database');

const app = express();

// Middleware للسماح بجميع الطلبات
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});
app.use(express.json());

// Initialize database
initializeDatabase();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/nodes', require('./routes/nodes'));

// استضافة الملفات الثابتة للواجهة الأمامية
app.use(express.static('../frontend'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('يمكنك الآن الوصول للواجهة عبر المتصفح على:');
  console.log('http://localhost:3000');
});
