import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

function AssignedTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://employee-tasks.onrender.com/api/tasks/employee/me/api/tasks');
        setTasks(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}m:${String(secs).padStart(2, '0')}s`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'; 
      case 'in-progress':
        return 'text-yellow-500'; 
      default:
        return 'text-gray-500'; 
    }
  };

  const getStatusLabel = (timeSpent) => {
    if (timeSpent > 0) {
      return 'Completed';
    } else {
      return 'Not Completed';
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`https://employee-tasks.onrender.com/api/tasks/employee/me/api/tasks/delete/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId)); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center w-full min-h-screen p-4 md:p-8">
      <div className="bg-blue-500 w-full md:w-10/12 lg:w-8/12 flex justify-center items-center rounded-tr-lg rounded-tl-lg shadow-md">
        <h1 className="text-3xl font-semibold text-white p-6">Assigned Tasks</h1>
      </div>
      {tasks.length === 0 ? (
        <div className='w-full h-96 md:w-10/12 lg:w-8/12 bg-white shadow-lg rounded-br-lg rounded-bl-lg overflow-hidden'>
          <p className="text-center text-gray-600 pt-10">No tasks assigned yet.</p>
        </div>
      ) : (
        <div className="w-full md:w-10/12 lg:w-8/12 bg-white shadow-lg rounded-br-lg rounded-bl-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col space-y-4">
              {tasks.map(task => (
                <div
                  key={task._id}
                  className="flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      <span>Assigned to: {task.assignedTo.username}</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-2xl font-bold">{formatTime(task.timeSpent)}</span>
                    <p className={`mt-2 ${getStatusColor(task.timeSpent > 0 ? 'completed' : 'yet-to-start')}`}>
                      {getStatusLabel(task.timeSpent)}
                    </p>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="mt-4 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignedTasks;
