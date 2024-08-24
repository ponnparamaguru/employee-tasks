import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import AssignTaskPage from './components/AssignTask'; 
import AssignedTasksPage from './components/AssignedTask';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute 
              element={<AdminDashboard />} 
              allowedRoles={['admin']} 
            />
          } 
        />
        
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute 
              element={<EmployeeDashboard />} 
              allowedRoles={['employee']} 
            />
          } 
        />
        
        <Route 
          path="/assign-task" 
          element={
            <ProtectedRoute 
              element={<AssignTaskPage />} 
              allowedRoles={['admin']} 
            />
          } 
        />
        
        <Route 
          path="/view-tasks" 
          element={
            <ProtectedRoute 
              element={<AssignedTasksPage />} 
              allowedRoles={['admin', 'employee']} 
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
