const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timeSpent: {
    type: Number,
    default: 0
  }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
