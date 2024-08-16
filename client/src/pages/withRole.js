import React from 'react';
import { Navigate } from 'react-router-dom';

const withRole = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const userRole = localStorage.getItem('role');

    if (allowedRoles && allowedRoles.includes(userRole)) {
      return <WrappedComponent {...props} />;
    }
     else {
      return <Navigate to="/not-authorized" />;
    }
  };
};

export default withRole;
