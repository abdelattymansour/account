const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// إنشاء منتج جديد
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// الحصول على جميع المنتجات
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// الحصول على منتج بواسطة ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// تحديث منتج
router.patch('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// حذف منتج
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
