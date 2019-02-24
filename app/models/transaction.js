const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  expense_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
    required: true  // require should be true
  },
  payment: {
    type: Number,
    required: true
  },
  person_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true  // require should be true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Transaction', transactionSchema)
