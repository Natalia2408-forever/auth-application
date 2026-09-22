import { authClient } from '../http/authClient';
import { httpClient } from '../http/httpClient';
import type { Credentials, RegisterData, AuthResponse } from '../types/types';

function register({ name, email, password }: RegisterData) {
  return authClient.post<void>('/registration', { name, email, password });
}

function login({ email, password }: Credentials) {
  return authClient.post<AuthResponse>('/login', { email, password });
}

function logout() {
  return httpClient.post<void>('/logout');
}

function refresh() {
  return authClient.get<AuthResponse>('/refresh');
}

export const authService = { register, login, logout, refresh };
