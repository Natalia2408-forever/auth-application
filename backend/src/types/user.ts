import { Request } from 'express';

export type UserPayload = {
  id: number;
  email: string | null;
  name: string;
};

export type AuthRequest = Request & {
  userId?: number;
};

export type OAuthProvider = 'google' | 'github';

export type ProviderField = `${OAuthProvider}Id`;
