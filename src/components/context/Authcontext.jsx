import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
import PropTypes from 'prop-types';
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
        const decodedToken = jwtDecode(token); 
        setUser({
          userId: decodedToken.user_id,
          username: decodedToken.name,
          userType: decodedToken.user_type,
          mobile_number: decodedToken.mobile_number,
          usertype_id: decodedToken.usertype_id,
          user_typecode:decodedToken.user_typecode,
          loginTime:decodedToken.loginTime
        });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    const decodedToken = jwtDecode(token);  
    setUser({
        userId: decodedToken.user_id,
        username: decodedToken.name,
        userType: decodedToken.user_type,
        mobile_number: decodedToken.mobile_number,
        usertype_id: decodedToken.usertype_id,
        user_typecode:decodedToken.user_typecode,
        loginTime:decodedToken.loginTime
    });
  };


  return (
    <AuthContext.Provider value={{ user, login,}}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, 
  };