import React from 'react';
import { Navigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const PrivateRoutes = ({element}) => {
    const { user } = useContext(UserContext)
    if (user && user.isAuthenticated === true) {
    return element;
  } else {
    return <Navigate to="/" replace />;
  }
};


export default PrivateRoutes;