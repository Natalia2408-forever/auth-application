import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Loader } from '../Loader/Loader.jsx';
import { ROUTES } from '../../router/routes.js';

export const RequireAuth = ({ children }) => {
  const { isChecked, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isChecked) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};
