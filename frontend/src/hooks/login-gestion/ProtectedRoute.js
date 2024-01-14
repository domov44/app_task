// ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { checkRole, getUserRole } from './AuthUtils';

function ProtectedRoute({ element, allowedRoles }) {
  const [authStatus, setAuthStatus] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
      setAuthStatus(role ? 'Authenticated' : 'NotAuthenticated');
    };

    fetchUserRole();
  }, []);

  if (
    authStatus === 'Authenticated' &&
    checkRole(userRole, allowedRoles)
  ) {
    return element;
  } else if (authStatus === 'NotAuthenticated') {
    return <Navigate to="/se-connecter" replace />;
  } else {
    return <div>En cours de vérification...</div>;
  }
}

export default ProtectedRoute;

