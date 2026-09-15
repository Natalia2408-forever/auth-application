import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { ROUTES } from '../../router/routes.js';

export const RequireNonAuth = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to={ROUTES.todos} replace />;
  }

  return children || <Outlet />;
};
