const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  parentAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  accountType: { 
    type: String, 
    enum: ['asset', 'liability', 'equity', 'revenue', 'expense'],
    required: true 
  },
  balance: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', AccountSchema);
