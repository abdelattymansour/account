const express = require('express');
const router = express.Router();
const { db } = require('../database');

// إنشاء فاتورة جديدة
router.post('/', (req, res) => {
  const { customer_id, items, total, tax, discount } = req.body;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // حفظ الفاتورة الأساسية
    db.run(
      'INSERT INTO invoices (customer_id, total, tax, discount) VALUES (?, ?, ?, ?)',
      [customer_id, total, tax, discount],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(400).send(err.message);
        }
        
        const invoiceId = this.lastID;
        
        // حفظ عناصر الفاتورة
        items.forEach(item => {
          db.run(
            'INSERT INTO invoice_items (invoice_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [invoiceId, item.product_id, item.quantity, item.price]
          );
        });
        
        db.run('COMMIT', (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).send(err.message);
          }
          res.status(201).send({ id: invoiceId });
        });
      }
    );
  });
});

// الحصول على جميع الفواتير
router.get('/', (req, res) => {
  const query = `
    SELECT i.*, c.name as customer_name 
    FROM invoices i
    LEFT JOIN contacts c ON i.customer_id = c.id
    ORDER BY i.date DESC
  `;
  
  db.all(query, [], (err, invoices) => {
    if (err) return res.status(500).send(err.message);
    res.send(invoices);
  });
});

// الحصول على فاتورة بواسطة ID
router.get('/:id', (req, res) => {
  const query = `
    SELECT i.*, c.name as customer_name 
    FROM invoices i
    LEFT JOIN contacts c ON i.customer_id = c.id
    WHERE i.id = ?
  `;
  
  db.get(query, [req.params.id], (err, invoice) => {
    if (err) return res.status(500).send(err.message);
    if (!invoice) return res.status(404).send();
    res.send(invoice);
  });
});

// تحديث فاتورة
router.patch('/:id', (req, res) => {
  const { customer_id, items, total, tax, discount } = req.body;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // تحديث الفاتورة الأساسية
    db.run(
      'UPDATE invoices SET customer_id = ?, total = ?, tax = ?, discount = ? WHERE id = ?',
      [customer_id, total, tax, discount, req.params.id],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(400).send(err.message);
        }
        
        // حذف عناصر الفاتورة القديمة
        db.run('DELETE FROM invoice_items WHERE invoice_id = ?', [req.params.id]);
        
        // حفظ عناصر الفاتورة الجديدة
        items.forEach(item => {
          db.run(
            'INSERT INTO invoice_items (invoice_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [req.params.id, item.product_id, item.quantity, item.price]
          );
        });
        
        db.run('COMMIT', (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).send(err.message);
          }
          res.send({ id: req.params.id });
        });
      }
    );
  });
});

// حذف فاتورة
router.delete('/:id', (req, res) => {
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // حذف عناصر الفاتورة
    db.run('DELETE FROM invoice_items WHERE invoice_id = ?', [req.params.id]);
    
    // حذف الفاتورة
    db.run('DELETE FROM invoices WHERE id = ?', [req.params.id], function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).send(err.message);
      }
      
      db.run('COMMIT', (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).send(err.message);
        }
        res.send({ id: req.params.id });
      });
    });
  });
});

module.exports = router;
