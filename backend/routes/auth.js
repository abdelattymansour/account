const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { db } = require('../database');

// تسجيل الدخول
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err || !user) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }
    
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if (hashedPassword !== user.password) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', {
      expiresIn: '8h'
    });
    
    res.send({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  });
});

// تسجيل مستخدم جديد (لأغراض التطوير فقط)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err || user) {
        return res.status(400).send({ error: 'User already exists' });
      }
      
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, role], (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        
        // إنشاء token
        const token = jwt.sign({ id: this.lastID, role: role }, 'your_secret_key', {
          expiresIn: '8h'
        });
        
        res.status(201).send({ token, user: { id: this.lastID, name: name, email: email, role: role } });
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
