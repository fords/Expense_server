const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  description:{
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  payments: [{
    pay: {
        type: Number,
        required: false,
    },
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Expense', expenseSchema)
