const express = require('express');
const router = express.Router();
const { db } = require('../database');

// تسجيل قيد يومي
router.post('/', (req, res) => {
  const { entries, date, description } = req.body;
  
  // التحقق من توازن القيد
  const totalDebit = entries.reduce((sum, e) => sum + (e.debit || 0), 0);
  const totalCredit = entries.reduce((sum, e) => sum + (e.credit || 0), 0);
  
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return res.status(400).send('القيد غير متوازن');
  }
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    const journalId = Date.now();
    const entryDate = date || new Date().toISOString().split('T')[0];
    
    // تسجيل القيد الرئيسي
    db.run(
      'INSERT INTO journal (entry_number, date, description) VALUES (?, ?, ?)',
      [journalId, entryDate, description]
    );
    
    // تسجيل بنود القيد
    entries.forEach(entry => {
      db.run(
        'INSERT INTO journal_entries (journal_id, account_id, debit, credit, description) VALUES (?, ?, ?, ?, ?)',
        [journalId, entry.account_id, entry.debit || 0, entry.credit || 0, entry.description]
      );
    });
    
    db.run('COMMIT', (err) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).send(err.message);
      }
      res.status(201).send({ 
        message: 'تم تسجيل القيد بنجاح',
        entryNumber: journalId 
      });
    });
  });
});

// الحصول على قيود اليومية
router.get('/', (req, res) => {
  const { startDate, endDate } = req.query;
  
  let query = 'SELECT * FROM journal';
  const params = [];
  
  if (startDate && endDate) {
    query += ' WHERE date BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }
  
  query += ' ORDER BY date DESC, entry_number DESC';
  
  db.all(query, params, (err, journals) => {
    if (err) return res.status(500).send(err.message);
    res.send(journals);
  });
});

// الحصول على تفاصيل قيد معين
router.get('/:id', (req, res) => {
  db.get(
    'SELECT * FROM journal WHERE entry_number = ?', 
    [req.params.id], 
    (err, journal) => {
      if (err) return res.status(500).send(err.message);
      if (!journal) return res.status(404).send('القيد غير موجود');
      
      db.all(
        'SELECT * FROM journal_entries WHERE journal_id = ?',
        [req.params.id],
        (err, entries) => {
          if (err) return res.status(500).send(err.message);
          res.send({ ...journal, entries });
        }
      );
    }
  );
});

module.exports = router;
