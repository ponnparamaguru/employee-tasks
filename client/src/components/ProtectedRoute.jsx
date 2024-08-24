import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const useAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) return { user: null };

  try {
    const decodedToken = jwtDecode(token);
    return { user: { role: decodedToken.role } };
  } catch (err) {
    return { user: null };
  }
};

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return element;
};

export default ProtectedRoute;
