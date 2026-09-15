import { lazy } from 'react';

export const LoginPage = lazy(() =>
  import('../pages/LoginPage/LoginPage.jsx').then(module => ({
    default: module.LoginPage,
  })),
);
export const RegistrationPage = lazy(() =>
  import('../pages/RegistrationPage/RegistrationPage.jsx').then(module => ({
    default: module.RegistrationPage,
  })),
);
export const OAuthSuccessPage = lazy(() =>
  import('../pages/OAuthSuccessPage/OAuthSuccessPage.jsx').then(module => ({
    default: module.OAuthSuccessPage,
  })),
);
export const TodosPage = lazy(() =>
  import('../pages/TodosPage/TodosPage.jsx').then(module => ({
    default: module.TodosPage,
  })),
);
export const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage/NotFoundPage.jsx').then(module => ({
    default: module.NotFoundPage,
  })),
);
