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
  friend: {
    type: mongoose.Schema.Types.ObjectId,  //mongoose.Types.Array
    ref: 'Person',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Expense', expenseSchema)
