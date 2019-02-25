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
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true  // require should be true
  },
  createdAtT: {type: Date, requred: true, index : true, default: Date.now}

}, {
  timestamps:
  {
        type: Date,
        required: true,
        default: Date.now
  },
})

module.exports = mongoose.model('Transaction', transactionSchema)
