const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); 
const User = require('../models/User');
const authMiddleware = require('../middleware/auth'); 
const adminMiddleware = require('../middleware/admin'); 

router.get('/tasks/employee/me', authMiddleware, async (req, res) => {
    try {
      const employeeId = req.user.id;
      const tasks = await Task.find({ assignedTo: employeeId });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
router.post('/tasks/assign', async (req, res) => {
  try {
    const { title, description, employeeId } = req.body;

    if (!title || !description || !employeeId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'employee') {
      return res.status(400).json({ message: 'Invalid employee' });
    }
    const newTask = new Task({ title, description, assignedTo: employeeId });
    await newTask.save();
    res.status(201).json({ message: 'Task assigned successfully', task: newTask });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/tasks/update/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.json(updatedTask);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/tasks/admin', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const tasks = await Task.find().populate('assignedTo', 'username');
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  router.patch('/tasks/update/:id/time', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { timeSpent } = req.body; 
  
      const updatedTask = await Task.findByIdAndUpdate(id, { timeSpent }, { new: true });
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.json(updatedTask);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/tasks', async (req, res) => {
    try {
      const tasks = await Task.find().populate('assignedTo', 'username');
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
    
module.exports = router;
