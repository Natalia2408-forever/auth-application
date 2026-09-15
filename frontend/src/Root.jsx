import { useContext, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { App } from './App.jsx';
import { AuthContext } from './components/AuthContext/AuthContext.jsx';
import { RequireAuth } from './components/RequireAuth/RequireAuth.jsx';
import { RequireNonAuth } from './components/RequiereNonAuth/RequireNonAuth.jsx';
import { Loader } from './components/Loader/Loader.jsx';
import { ROUTES } from './router/routes.js';
import {
  LoginPage,
  RegistrationPage,
  OAuthSuccessPage,
  TodosPage,
  NotFoundPage,
} from './router/lazyPages.js';

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
