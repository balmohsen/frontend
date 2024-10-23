// src/components/PublicRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (auth.token) {
    // Redirect based on role
    if (auth.user.role === 'administrator') {
      return <Navigate to="/admin" replace />;
    } else if (['finance', 'manager', 'vp'].includes(auth.user.role)) {
      return <Navigate to="/pending-approvals" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute;
