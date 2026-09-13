import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Loader } from '../Loader/Loader.jsx';

export const AuthGate = ({ children }) => {
  const { isChecked } = useContext(AuthContext);

  if (!isChecked) {
    return <Loader />;
  }

  return children;
};
