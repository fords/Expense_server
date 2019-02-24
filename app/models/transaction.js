const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  expense_name: {
    type: String,
    required: false  // require should be true
  },
  person_name:
    [{
      type: String,
      required: false
    }],

  payment:
    [{
      type: Number,
      required: false
    }],

  index_expense: {
    type: Number,
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // require should be true
  }

}, {
  timestamps: false
})

module.exports = mongoose.model('Transaction', transactionSchema)
