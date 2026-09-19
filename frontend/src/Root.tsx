import { useContext, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { App } from './App';
import { AuthContext } from './components/AuthContext/AuthContext';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { RequireNonAuth } from './components/RequireNonAuth/RequireNonAuth';
import { Loader } from './components/Loader/Loader';
import { ROUTES } from './router/routes';
import {
  LoginPage,
  RegistrationPage,
  OAuthSuccessPage,
  TodosPage,
  NotFoundPage,
} from './router/lazyPages';

export const Root = () => {
  const { user } = useContext(AuthContext);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            index
            element={
              <Navigate to={user ? ROUTES.todos : ROUTES.login} replace />
            }
          />
          <Route element={<RequireNonAuth />}>
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route path={ROUTES.register} element={<RegistrationPage />} />
          </Route>
          <Route path={ROUTES.oauthSuccess} element={<OAuthSuccessPage />} />
          <Route element={<RequireAuth />}>
            <Route path={ROUTES.todos} element={<TodosPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
