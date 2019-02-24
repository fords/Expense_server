const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  // text: {
  //   type: String,
  //   required: true
  // },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('History', historySchema)
