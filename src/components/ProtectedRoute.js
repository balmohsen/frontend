// frontend/src/components/ProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles }) => {
    const { auth } = useContext(AuthContext);

    if (!auth.token) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (requiredRoles && !requiredRoles.includes(auth.user.role.toLowerCase())) {
        // Logged in but role not authorized
        return <Navigate to="/" replace />;
    }

    // Authorized
    return children;
};

export default ProtectedRoute;
