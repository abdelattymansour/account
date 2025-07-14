const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// إنشاء عميل جديد
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// الحصول على جميع العملاء
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// الحصول على عميل بواسطة ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});

// تحديث عميل
router.patch('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// حذف عميل
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
