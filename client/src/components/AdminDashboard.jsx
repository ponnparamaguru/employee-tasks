import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data); 
      } catch (err) {
        console.error(err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employees');
        setEmployees(response.data); 
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
    fetchEmployees();
  }, []);

  return (
    <div className='bg-gray-100 min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8'>
      <div className='w-full max-w-4xl bg-white shadow-md rounded-lg p-12'>
        <h1 className='text-2xl sm:text-3xl font-semibold text-gray-800 mb-2'>Admin Dashboard</h1>
        <h2 className='text-lg sm:text-xl text-gray-600 mb-4'>Welcome, Admin!</h2>
        <div className='flex flex-wrap justify-between'>
          <div className='bg-white shadow-lg rounded-lg p-6 w-full sm:w-1/2 md:w-1/3 lg:w-96 lg:h-64 flex flex-col items-center'>
            <p className='text-base sm:text-lg text-gray-700 mb-2'>Total Employees</p>
            <span className='text-3xl sm:text-4xl md:text-8xl md:pt-4 font-semibold text-gray-800'>{employees.length}</span>
          </div>
          <div className='bg-white shadow-lg rounded-lg p-6 w-full sm:w-1/2 md:w-1/3 lg:w-96 flex flex-col items-center'>
            <p className='text-base sm:text-lg text-gray-700 mb-2'>Total Tasks</p>
            <span className='text-3xl sm:text-4xl md:text-8xl md:pt-4 font-semibold text-gray-800'>{tasks.length}</span>
          </div>
        </div>
      <div className='flex flex-wrap justify-center gap-5 md:gap-10 pt-10'>
      <div className='flex flex-wrap justify-center gap-5 md:gap-10 pt-10'>
        
  <a href="/assign-task">
  <button className='bg-blue-500 text-white py-2 px-20 md:py-2 md:px-36 rounded-md text-lg hover:bg-blue-600 transition-colors duration-300'>
    Assign Task
  </button></a>
  <a href='/view-tasks'>
    <button className='bg-blue-500 text-white py-2 px-20 md:py-2 md:px-36 rounded-md text-lg hover:bg-blue-600 transition-colors duration-300'>
      View Tasks
    </button>
  </a>
</div>

      </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
