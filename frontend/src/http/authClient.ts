import { createClient } from './createClient';

export const authClient = createClient();

authClient.interceptors.response.use(res => res.data);
