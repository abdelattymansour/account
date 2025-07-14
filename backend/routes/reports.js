const express = require('express');
const router = express.Router();
const { db } = require('../database');

// ميزان المراجعة
router.get('/trial-balance', (req, res) => {
  const { startDate, endDate } = req.query;
  
  const query = `
    SELECT 
      a.id, a.code, a.name, a.type,
      COALESCE(SUM(e.debit), 0) as total_debit,
      COALESCE(SUM(e.credit), 0) as total_credit
    FROM accounts a
    LEFT JOIN journal_entries e ON a.id = e.account_id
    LEFT JOIN journal j ON e.journal_id = j.entry_number
    WHERE (? IS NULL OR j.date >= ?)
      AND (? IS NULL OR j.date <= ?)
    GROUP BY a.id, a.code, a.name, a.type
    ORDER BY a.code
  `;
  
  db.all(query, [startDate, startDate, endDate, endDate], (err, results) => {
    if (err) return res.status(500).send(err.message);
    
    // حساب المجاميع
    const totals = {
      debit: results.reduce((sum, acc) => sum + acc.total_debit, 0),
      credit: results.reduce((sum, acc) => sum + acc.total_credit, 0)
    };
    
    res.send({ accounts: results, totals });
  });
});

// قائمة الدخل
router.get('/income-statement', (req, res) => {
  const { startDate, endDate } = req.query;
  
  const query = `
    SELECT 
      a.type,
      SUM(e.debit) - SUM(e.credit) as balance
    FROM accounts a
    JOIN journal_entries e ON a.id = e.account_id
    JOIN journal j ON e.journal_id = j.entry_number
    WHERE a.type IN ('revenue', 'expense')
      AND (? IS NULL OR j.date >= ?)
      AND (? IS NULL OR j.date <= ?)
    GROUP BY a.type
  `;
  
  db.all(query, [startDate, startDate, endDate, endDate], (err, results) => {
    if (err) return res.status(500).send(err.message);
    
    const revenue = results.find(r => r.type === 'revenue')?.balance || 0;
    const expense = results.find(r => r.type === 'expense')?.balance || 0;
    const netIncome = revenue - expense;
    
    res.send({ revenue, expense, netIncome });
  });
});

module.exports = router;
