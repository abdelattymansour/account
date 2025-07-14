const express = require('express');
const router = express.Router();
const { db } = require('../database');

// إنشاء مصروف جديد
router.post('/', (req, res) => {
  const { amount, category, description, user_id } = req.body;
  
  db.run(
    'INSERT INTO expenses (amount, category, description, user_id) VALUES (?, ?, ?, ?)',
    [amount, category, description, user_id],
    function(err) {
      if (err) return res.status(400).send(err.message);
      
      db.get('SELECT * FROM expenses WHERE id = ?', [this.lastID], (err, expense) => {
        if (err) return res.status(500).send(err.message);
        res.status(201).send(expense);
      });
    }
  );
});

// الحصول على جميع المصروفات
router.get('/', (req, res) => {
  db.all('SELECT * FROM expenses ORDER BY date DESC', [], (err, expenses) => {
    if (err) return res.status(500).send(err.message);
    res.send(expenses);
  });
});

// الحصول على مصروف بواسطة ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM expenses WHERE id = ?', [req.params.id], (err, expense) => {
    if (err) return res.status(500).send(err.message);
    if (!expense) return res.status(404).send();
    res.send(expense);
  });
});

// تحديث مصروف
router.patch('/:id', (req, res) => {
  const { amount, category, description, user_id } = req.body;
  
  db.run(
    'UPDATE expenses SET amount = ?, category = ?, description = ?, user_id = ? WHERE id = ?',
    [amount, category, description, user_id, req.params.id],
    function(err) {
      if (err) return res.status(400).send(err.message);
      
      db.get('SELECT * FROM expenses WHERE id = ?', [req.params.id], (err, expense) => {
        if (err) return res.status(500).send(err.message);
        if (!expense) return res.status(404).send();
        res.send(expense);
      });
    }
  );
});

// حذف مصروف
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM expenses WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).send(err.message);
    
    db.get('SELECT * FROM expenses WHERE id = ?', [req.params.id], (err, expense) => {
      if (err) return res.status(500).send(err.message);
      if (!expense) return res.status(404).send();
      res.send(expense);
    });
  });
});

module.exports = router;
