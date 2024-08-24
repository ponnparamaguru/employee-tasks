import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssignTask() {
  const [employees, setEmployees] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [success, setSuccess] = useState(''); 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employees');
        setEmployees(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  const assignTask = async () => {
    try {
      await axios.post('http://localhost:5000/api/tasks/assign', {
        title: taskTitle,
        description: taskDescription,
        employeeId: selectedEmployee
      });
      setTaskTitle('');
      setTaskDescription('');
      setSelectedEmployee('');
      setSuccess('Task assigned successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center w-full min-h-screen p-4 md:p-8">
      <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Assign Task</h1>
      <div className="bg-white shadow-md rounded-lg w-full max-w-md md:max-w-xl lg:max-w-2xl p-6 md:p-8">
        <form className="space-y-6">
        {success && (
          <div className="mb-4 text-green-600 text-center">
            {success}
          </div>
        )}
          <div>
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-2">
              Select Employee
            </label>
            <select
              id="employee"
              onChange={(e) => setSelectedEmployee(e.target.value)}
              value={selectedEmployee}
              className="border border-gray-300 bg-white text-gray-900 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              id="taskTitle"
              type="text"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="border border-gray-300 bg-white text-gray-900 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Task Description
            </label>
            <textarea
              id="taskDescription"
              placeholder="Enter task description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="border border-gray-300 bg-white text-gray-900 p-2 rounded-md w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={assignTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Assign Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssignTask;
