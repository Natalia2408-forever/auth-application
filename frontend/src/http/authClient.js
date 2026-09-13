import { createClient } from './createClient.js';

export const authClient = createClient();

authClient.interceptors.response.use(res => res.data);
