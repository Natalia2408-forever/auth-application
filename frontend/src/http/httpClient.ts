import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { createClient } from './createClient';
import { authService } from '../services/authService';
import { accessTokenService } from '../services/accessTokenService';

export const httpClient = createClient();

httpClient.interceptors.request.use(onRequest);
httpClient.interceptors.response.use(onResponseSuccess, onResponseError);

function onRequest(request: InternalAxiosRequestConfig) {
  const accessToken = accessTokenService.get();

  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return request;
}

function onResponseSuccess(res: any) {
  return res.data;
}

async function onResponseError(error: AxiosError) {
  const originalRequest = error.config;

  if (!error.response || error.response.status !== 401 || !originalRequest) {
    throw error;
  }

  const { accessToken } = await authService.refresh();

  accessTokenService.save(accessToken);

  return httpClient.request(originalRequest);
}
