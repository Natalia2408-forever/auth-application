import { createContext, useEffect, useMemo, useState } from 'react';
import { accessTokenService } from '../../services/accessTokenService.js';
import { authService } from '../../services/authService.js';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isChecked, setChecked] = useState(false);

  async function checkAuth() {
    try {
      const { accessToken, user } = await authService.refresh();

      accessTokenService.save(accessToken);
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setChecked(true);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, []);

  async function login({ email, password }) {
    const { accessToken, user } = await authService.login({ email, password });

    accessTokenService.save(accessToken);
    setUser(user);
  }

  async function logout() {
    await authService.logout();
    accessTokenService.remove();
    setUser(null);
  }

  const value = useMemo(
    () => ({ isChecked, user, checkAuth, login, logout }),
    [user, isChecked],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
