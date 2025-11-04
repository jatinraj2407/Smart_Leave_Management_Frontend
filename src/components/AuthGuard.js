import React from 'react';
import { Navigate } from 'react-router-dom';

function AuthGuard({ children }) {
  const token = sessionStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/user-login" replace />;
  }

  return children;
}

export default AuthGuard;
