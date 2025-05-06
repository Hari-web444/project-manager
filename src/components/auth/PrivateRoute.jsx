// src/components/auth/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.warning('Please login first!', { autoClose: 2000 });
      // Delay redirect slightly so toast can render
      const timeout = setTimeout(() => {
        setRedirect(true);
      }, 10); // 10ms is enough
      return () => clearTimeout(timeout);
    }
  }, [token]);

  if (!token && redirect) {
    return <Navigate to="/login" replace />;
  }

  return token ? children : null; // Show nothing briefly if redirecting
};

export default PrivateRoute;
