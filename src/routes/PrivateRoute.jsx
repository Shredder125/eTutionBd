import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useUserAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return children;
    }

    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;