import { authClient } from '../http/authClient.js';
import { httpClient } from '../http/httpClient.js';

function register({ name, email, password }) {
  return authClient.post('/registration', { name, email, password });
}

function login({ email, password }) {
  return authClient.post('/login', { email, password });
}

function logout() {
  return httpClient.post('/logout');
}

function refresh() {
  return authClient.get('/refresh');
}

export const authService = {
  register,
  login,
  logout,
  refresh,
};
