
import React, { useEffect, useState } from 'react';
import { Navigate,useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const [redirect, setRedirect] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (!token) {
      toast.warning('Please login first!', { autoClose: 2000 });
      // Delay redirect slightly so toast can render
      const timeout = setTimeout(() => {
        setRedirect(true);
      }, 10); 
      return () => clearTimeout(timeout);
    }
  }, [token]);

  if (!token && redirect) {
    return <Navigate to="/" state={{ from: location }}  replace />;
  }

  return token ? children : null;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default PrivateRoute;
