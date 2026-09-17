import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import { accessTokenService } from '../../services/accessTokenService';
import { authService } from '../../services/authService';
import type { User, Credentials } from '../../types/types';

interface AuthContextValue {
  isChecked: boolean;
  user: User | null;
  checkAuth: () => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue>(
  {} as AuthContextValue,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isChecked, setChecked] = useState(false);
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  function checkAuth(): Promise<void> {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = authService
      .refresh()
      .then(({ accessToken, user }) => {
        accessTokenService.save(accessToken);
        setUser(user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setChecked(true);
        refreshPromiseRef.current = null;
      });

    return refreshPromiseRef.current;
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function login({ email, password }: Credentials) {
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
