import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ROUTES } from '../../router/routes.js';
import styles from './AppHeader.module.scss';

export const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout()
      .then(() => navigate(ROUTES.login))
      .catch(error => console.error('Logout failed:', error))
      .finally(() => setIsLoggingOut(false));
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <i className="fa-solid fa-circle-notch" aria-hidden="true" />
        <span>Todoapp</span>
      </div>
      <div className={styles.right}>
        {user && <span className={styles.email}>{user.email}</span>}
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut && (
            <span className={styles.spinner} aria-hidden="true" />
          )}
          {isLoggingOut ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </header>
  );
};
