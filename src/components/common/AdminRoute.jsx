import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from './Loader';

/**
 * Admin-only route guard.
 * NOTE: frontend role checks only control the UI — the backend must always
 * verify the real role on every admin request (e.g. GET /admin/stats → 403).
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader fullScreen text="Ruxsat tekshirilmoqda..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Backend-provided role only. Never hardcode privileged emails here.
  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminRoute;
