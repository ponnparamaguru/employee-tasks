import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaStop, FaRedo } from 'react-icons/fa';

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [timers, setTimers] = useState({});
  const [timeSpent, setTimeSpent] = useState({}); 
  const [pausedTasks, setPausedTasks] = useState(new Set());

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://employee-tasks.onrender.com/api/tasks/employee/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const tasksData = response.data;
        setTasks(tasksData);

        const activeTasks = tasksData.filter(task => task.status === 'in-progress');
        const newTimeSpent = {};
        const newTimers = {};

        activeTasks.forEach(task => {
          newTimeSpent[task._id] = task.timeSpent || 0;

          if (task.startTime) {
            const now = new Date();
            const startTime = new Date(task.startTime);
            const elapsedTime = Math.floor((now - startTime) / 1000);
            newTimeSpent[task._id] += elapsedTime;
          }

          newTimers[task._id] = setInterval(() => {
            setTimeSpent(prev => ({ ...prev, [task._id]: (prev[task._id] || 0) + 1 }));
          }, 1000);
        });

        setTimers(newTimers);
        setTimeSpent(newTimeSpent);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();

    return () => {
      Object.values(timers).forEach(timer => clearInterval(timer));
    };
  }, []);

  const updateTaskStatus = async (taskId, status, updateFields = {}) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/update/${taskId}`, {
        status,
        ...updateFields
      });

      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, status, ...updateFields } : task
      ));

      if (status === 'completed') {
        clearInterval(timers[taskId]);
        setTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[taskId];
          return newTimers;
        });
        setTimeSpent(prev => {
          const { [taskId]: _, ...rest } = prev;
          return rest;
        });
        setPausedTasks(prev => new Set([...prev].filter(id => id !== taskId)));
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const startTimer = (task) => {
    if (timers[task._id]) return; 

    const timerId = setInterval(() => {
      setTimeSpent(prev => ({ ...prev, [task._id]: (prev[task._id] || 0) + 1 }));
    }, 1000);

    setTimers(prev => ({ ...prev, [task._id]: timerId }));
    setPausedTasks(prev => new Set([...prev].filter(id => id !== task._id)));
    updateTaskStatus(task._id, 'in-progress', { startTime: new Date(), timeSpent: timeSpent[task._id] || 0 });
  };

  const pauseTimer = (taskId) => {
    clearInterval(timers[taskId]);
    setTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[taskId];
      return newTimers;
    });
    setPausedTasks(prev => new Set([...prev, taskId]));
    updateTaskStatus(taskId, 'in-progress', { timeSpent: timeSpent[taskId], startTime: new Date() });
  };

  const resumeTimer = (taskId) => {
    if (timers[taskId]) return; 

    const timerId = setInterval(() => {
      setTimeSpent(prev => ({ ...prev, [taskId]: (prev[taskId] || 0) + 1 }));
    }, 1000);

    setTimers(prev => ({ ...prev, [taskId]: timerId }));
    setPausedTasks(prev => new Set([...prev].filter(id => id !== taskId)));
    updateTaskStatus(taskId, 'in-progress', { startTime: new Date(), timeSpent: timeSpent[taskId] });
  };

  const stopTimer = async (taskId) => {
    clearInterval(timers[taskId]);
    setTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[taskId];
      return newTimers;
    });
    setPausedTasks(prev => new Set([...prev].filter(id => id !== taskId)));
    await updateTaskStatus(taskId, 'completed', {
      endTime: new Date(),
      timeSpent: timeSpent[taskId]
    });
  };

  const restartTimer = (task) => {
    clearInterval(timers[task._id]);
    setTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[task._id];
      return newTimers;
    });
    setTimeSpent(prev => ({ ...prev, [task._id]: 0 }));
    setPausedTasks(prev => new Set([...prev].filter(id => id !== task._id)));

    const timerId = setInterval(() => {
      setTimeSpent(prev => ({ ...prev, [task._id]: (prev[task._id] || 0) + 1 }));
    }, 1000);

    setTimers(prev => ({ ...prev, [task._id]: timerId }));
    updateTaskStatus(task._id, 'in-progress', { startTime: new Date(), timeSpent: 0 });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center w-full min-h-screen p-4 md:p-8">
      <div className="bg-blue-500 w-full md:w-10/12 lg:w-8/12 flex justify-center items-center rounded-tr-lg rounded-tl-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-white p-6">Employee Tasks</h1>
      </div>
      {tasks.length === 0 ? (
        <div className="w-full h-96 md:w-10/12 lg:w-8/12 bg-white shadow-lg rounded-br-lg rounded-bl-lg overflow-hidden">
          <p className="text-center text-gray-600 mt-4">No tasks available.</p>
        </div>
      ) : (
        <div className="w-full md:w-10/12 lg:w-8/12 bg-white shadow-lg rounded-br-lg rounded-bl-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col space-y-4">
              {tasks.map(task => (
                <div
                  key={task._id}
                  className="relative border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                    <div className="flex space-x-2 mt-4">
                      {timers[task._id] ? (
                        pausedTasks.has(task._id) ? (
                          <button
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                            onClick={() => resumeTimer(task._id)}
                          >
                            <FaPlay />
                          </button>
                        ) : (
                          <>
                            <button
                              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              onClick={() => pauseTimer(task._id)}
                            >
                              <FaPause />
                            </button>
                            <button
                              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                              onClick={() => stopTimer(task._id)}
                            >
                              <FaStop />
                            </button>
                          </>
                        )
                      ) : (
                        <button
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onClick={() => startTimer(task)}
                        >
                          <FaPlay />
                        </button>
                      )}
                      {timers[task._id] && !pausedTasks.has(task._id) && (
                        <button
                          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          onClick={() => restartTimer(task)}
                        >
                          <FaRedo />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className={`font-bold ${
                        task.status === 'completed' 
                            ? 'text-green-500 md:text-2xl text-xl' 
                            : 'text-gray-800 md:text-4xl text-3xl' 
                        }`}>
                        {task.status === 'completed' 
                            ? 'Completed' 
                            : formatTime(timeSpent[task._id] || task.timeSpent || 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
