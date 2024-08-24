require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', taskRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect('mongodb+srv://mern-task:tR0eW29oip5tCbXT@mern-task.pwbzq.mongodb.net/mern-task?retryWrites=true&w=majority&appName=mern-task')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
