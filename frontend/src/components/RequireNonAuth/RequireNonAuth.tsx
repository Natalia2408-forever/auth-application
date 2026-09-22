import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { ROUTES } from '../../router/routes';

export const RequireNonAuth = ({ children }: { children?: ReactNode }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to={ROUTES.todos} replace />;
  }

  return children || <Outlet />;
};
