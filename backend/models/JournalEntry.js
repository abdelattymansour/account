const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
  entryNumber: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  entries: [{
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    description: { type: String }
  }],
  isPosted: { type: Boolean, default: false },
  postedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
