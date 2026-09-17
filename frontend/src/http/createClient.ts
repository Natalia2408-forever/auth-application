import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

interface ApiClient extends Omit<
  AxiosInstance,
  'get' | 'post' | 'put' | 'patch' | 'delete'
> {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;

  post<T>(
    url: string,
    data?: Record<string, string | number | boolean | null>,
    config?: AxiosRequestConfig,
  ): Promise<T>;

  put<T>(
    url: string,
    data?: Record<string, string | number | boolean | null>,
    config?: AxiosRequestConfig,
  ): Promise<T>;

  patch<T>(
    url: string,
    data?: Record<string, string | number | boolean | null>,
    config?: AxiosRequestConfig,
  ): Promise<T>;

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export function createClient(): ApiClient {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  }) as ApiClient;
}
