import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authentication-token');

  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
