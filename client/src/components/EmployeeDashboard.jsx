import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaStop, FaRedo } from 'react-icons/fa';

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [completedTaskTimes, setCompletedTaskTimes] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://employee-tasks.onrender.com/api/tasks/employee/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const tasksData = response.data;

        const initialCompletedTaskTimes = {};
        let initialCurrentTask = null;

        tasksData.forEach(task => {
          if (task.status === 'completed') {
            initialCompletedTaskTimes[task._id] = task.timeSpent || 0;
          } else if (task.status === 'in-progress') {
            initialCurrentTask = task;

            const now = new Date();
            const startTime = new Date(task.startTime);
            const savedTimeSpent = task.timeSpent || 0;
            const elapsedTime = Math.floor((now - startTime) / 1000);

            setTimeSpent(savedTimeSpent + elapsedTime);
            setStartTime(startTime);
          }
        });

        setTasks(tasksData);
        setCompletedTaskTimes(initialCompletedTaskTimes);
        setCurrentTask(initialCurrentTask);

        if (initialCurrentTask) {
          setTimer(setInterval(() => {
            setTimeSpent(prev => prev + 1);
          }, 1000));
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();

    return () => clearInterval(timer);
  }, []);

  const updateTaskStatus = async (taskId, status, updateFields = {}) => {
    try {
      await axios.patch(`https://employee-tasks.onrender.com/api/tasks/update/${taskId}`, {
        status,
        ...updateFields
      });
      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, status, ...updateFields } : task
      ));
      if (status === 'completed') {
        setCompletedTaskTimes(prev => ({ ...prev, [taskId]: timeSpent }));
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const startTimer = (task) => {
    setCurrentTask(task);
    const now = new Date();
    setStartTime(now);
    setTimer(setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000));
    updateTaskStatus(task._id, 'in-progress', { startTime: now });
  };

  const pauseTimer = () => {
    clearInterval(timer);
    setTimer(null);
    setIsPaused(true);

    updateTaskStatus(currentTask._id, 'in-progress', { timeSpent, startTime });
  };

  const resumeTimer = () => {
    const now = new Date();
    const elapsed = Math.floor((now - startTime) / 1000);
    setStartTime(new Date(startTime.getTime() + elapsed * 1000));
    setIsPaused(false);
    setTimer(setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000));
  };

  const stopTimer = async () => {
    clearInterval(timer);
    setTimer(null);
    setIsPaused(false);

    await updateTaskStatus(currentTask._id, 'completed', {
      endTime: new Date(),
      timeSpent
    });

    setCurrentTask(null);
    setTimeSpent(0);
  };

  const restartTimer = (task) => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsPaused(false);
    const now = new Date();
    setStartTime(now);
    setTimeSpent(0);
    setTimer(setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000));
    updateTaskStatus(task._id, 'in-progress', { startTime: now });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center w-full min-h-screen p-4 md:p-8">
      <div className="bg-blue-500 w-full md:w-10/12 lg:w-8/12 flex justify-center items-center rounded-tr-lg rounded-tl-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-white p-6">Employee Dashboard</h1>
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
                      {currentTask && currentTask._id === task._id ? (
                        isPaused ? (
                          <button
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                            onClick={resumeTimer}
                          >
                            <FaPlay />
                          </button>
                        ) : (
                          <>
                            <button
                              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              onClick={pauseTimer}
                            >
                              <FaPause />
                            </button>
                            <button
                              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                              onClick={stopTimer}
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
                      {currentTask && currentTask._id === task._id && !isPaused && (
                        <button
                          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          onClick={() => restartTimer(task)}
                        >
                          <FaRedo />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-800 md:text-4xl text-3xl font-bold">
                    {currentTask && currentTask._id === task._id && !isPaused
                      ? formatTime(timeSpent)
                      : formatTime(completedTaskTimes[task._id] || 0)}
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
