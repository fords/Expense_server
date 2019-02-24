const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  expense_name: {
    type: String,
    required: true  // require should be true
  },
  person_name:
    [{
      type: String,
      required: true
    }],

  payment:
    [{
      type: Number,
      required: true
    }],

  index_expense: {
    type: Number,
    required: true
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Transaction', transactionSchema)
