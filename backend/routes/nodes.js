const express = require('express');
const router = express.Router();
const Node = require('../models/Node');

// تسجيل نود جديد
router.post('/register', async (req, res) => {
  try {
    const node = new Node(req.body);
    await node.save();
    res.status(201).send(node);
  } catch (error) {
    res.status(400).send(error);
  }
});

// الحصول على جميع النودات
router.get('/', async (req, res) => {
  try {
    const nodes = await Node.find().sort({ createdAt: -1 });
    res.send(nodes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// تحديث حالة النود
router.patch('/:id/status', async (req, res) => {
  try {
    const node = await Node.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updatedAt: Date.now() },
      { new: true }
    );
    if (!node) return res.status(404).send();
    res.send(node);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
