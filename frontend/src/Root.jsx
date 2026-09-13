import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { App } from './App.jsx';
import { AuthContext } from './components/AuthContext/AuthContext.jsx';
import { RequireAuth } from './components/RequireAuth/RequireAuth.jsx';
import { RequireNonAuth } from './components/RequiereNonAuth/RequireNonAuth.jsx';
import { LoginPage } from './pages/LoginPage/LoginPage.jsx';
import { RegistrationPage } from './pages/RegistrationPage/RegistrationPage.jsx';
import { OAuthSuccessPage } from './pages/OAuthSuccessPage/OAuthSuccessPage.jsx';
import { TodosPage } from './pages/TodosPage/TodosPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage.jsx';
import { ROUTES } from './router/routes.js';

export const Root = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route
          index
          element={<Navigate to={user ? ROUTES.todos : ROUTES.login} replace />}
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
  );
};
