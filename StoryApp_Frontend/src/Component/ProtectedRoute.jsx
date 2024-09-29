import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({ element: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('token');
  
    if (!isAuthenticated ) {
      return <Navigate to="/" />;
    }
    return <Component {...rest} />;
  };
  export default ProtectedRoute;