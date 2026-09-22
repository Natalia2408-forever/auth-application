import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { createClient } from './createClient';
import { authService } from '../services/authService';
import { accessTokenService } from '../services/accessTokenService';

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

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

function onResponseSuccess(res: AxiosResponse) {
  return res.data;
}

async function onResponseError(error: AxiosError) {
  const originalRequest = error.config as RetriableRequest | undefined;

  if (
    !error.response ||
    error.response.status !== 401 ||
    !originalRequest ||
    originalRequest._retry
  ) {
    throw error;
  }

  originalRequest._retry = true;

  const { accessToken } = await authService.refresh();

  accessTokenService.save(accessToken);

  return httpClient.request(originalRequest);
}
