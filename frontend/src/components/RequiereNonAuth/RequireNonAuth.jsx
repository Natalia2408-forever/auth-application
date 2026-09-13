import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Loader } from '../Loader/Loader.jsx';
import { ROUTES } from '../../router/routes.js';

export const RequireNonAuth = ({ children }) => {
  const { isChecked, user } = useContext(AuthContext);

  if (!isChecked) {
    return <Loader />;
  }

  if (user) {
    return <Navigate to={ROUTES.todos} replace />;
  }

  return children || <Outlet />;
};
