import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If user role is not allowed, redirect to their home page
        const redirectPath = user.role === 'admin' ? '/dashboard' : '/my-tasks';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
