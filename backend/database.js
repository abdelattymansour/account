const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// الجداول الأساسية
const initDB = () => {
  db.serialize(() => {
    // شجرة الحسابات
    db.run(`CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      parent_id INTEGER,
      FOREIGN KEY (parent_id) REFERENCES accounts (id)
    )`);
    
    // العملاء/الموردين
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      taxNumber TEXT,
      notes TEXT,
      type TEXT NOT NULL CHECK (type IN ('customer', 'supplier'))
    )`);
    
    // المنتجات
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0
    )`);
    
    // الفواتير
    db.run(`CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      date TEXT DEFAULT (datetime('now')),
      total REAL NOT NULL,
      tax REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      FOREIGN KEY (customer_id) REFERENCES contacts (id)
    )`);
    
    // عناصر الفواتير
    db.run(`CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES invoices (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`);
    
    // القيود اليومية
    db.run(`CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL DEFAULT (datetime('now')),
      account_id INTEGER NOT NULL,
      debit REAL,
      credit REAL,
      description TEXT,
      FOREIGN KEY (account_id) REFERENCES accounts (id)
    )`);
  });
};

module.exports = { db, initDB };
