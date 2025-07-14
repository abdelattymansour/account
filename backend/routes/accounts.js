const express = require('express');
const router = express.Router();
const { db } = require('../database');

// إنشاء حساب جديد
router.post('/', (req, res) => {
  const { code, name, type, parent_id } = req.body;
  
  db.run(
    'INSERT INTO accounts (code, name, type, parent_id) VALUES (?, ?, ?, ?)',
    [code, name, type, parent_id],
    function(err) {
      if (err) return res.status(400).send(err.message);
      res.status(201).send({ id: this.lastID });
    }
  );
});

// الحصول على شجرة الحسابات
router.get('/tree', (req, res) => {
  db.all('SELECT * FROM accounts ORDER BY code', [], (err, accounts) => {
    if (err) return res.status(500).send(err.message);
    
    // بناء الهيكل الشجري
    const buildTree = (parentId = null) => {
      return accounts
        .filter(account => account.parent_id === parentId)
        .map(account => ({
          ...account,
          children: buildTree(account.id)
        }));
    };
    
    res.send(buildTree());
  });
});

// الحصول على حساب بواسطة ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM accounts WHERE id = ?', [req.params.id], (err, account) => {
    if (err) return res.status(500).send(err.message);
    if (!account) return res.status(404).send('الحساب غير موجود');
    res.send(account);
  });
});

// تحديث حساب
router.put('/:id', (req, res) => {
  const { code, name, type, parent_id } = req.body;
  db.run(
    'UPDATE accounts SET code = ?, name = ?, type = ?, parent_id = ? WHERE id = ?',
    [code, name, type, parent_id, req.params.id],
    function(err) {
      if (err) return res.status(400).send(err.message);
      res.send({ updated: this.changes });
    }
  );
});

// إدخال قيد محاسبي
router.post('/entry', (req, res) => {
  const { entries } = req.body;
  
  // التحقق من توازن القيد (مدين = دائن)
  const totalDebit = entries.reduce((sum, e) => sum + (e.debit || 0), 0);
  const totalCredit = entries.reduce((sum, e) => sum + (e.credit || 0), 0);
  
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return res.status(400).send('القيد غير متوازن');
  }
  
  // تنفيذ الإدخالات
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    entries.forEach(entry => {
      db.run(
        'INSERT INTO journal_entries (account_id, date, description, debit, credit) VALUES (?, ?, ?, ?, ?)',
        [entry.account_id, entry.date || new Date(), entry.description, entry.debit || 0, entry.credit || 0]
      );
    });
    
    db.run('COMMIT', (err) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).send(err.message);
      }
      res.status(201).send({ message: 'تم إدخال القيد بنجاح' });
    });
  });
});

module.exports = router;
