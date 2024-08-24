import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://employee-tasks.onrender.com/api/tasks/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleStart = async (taskId) => {
    try {
      await axios.post(`https://employee-tasks.onrender.com/api/tasks/${taskId}/start`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  const handleStop = async (taskId) => {
    try {
      await axios.post(`https://employee-tasks.onrender.com/api/tasks/${taskId}/stop`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTasks(); 
    } catch (error) {
      console.error('Error stopping task:', error);
    }
  };

  return (
    <div>
      <h1>My Tasks</h1>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            {task.status === 'pending' && <button onClick={() => handleStart(task._id)}>Start Task</button>}
            {task.status === 'in-progress' && <button onClick={() => handleStop(task._id)}>Stop Task</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
