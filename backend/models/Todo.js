const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['Personal', 'Work', 'Me-Time', 'Household'],
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);
