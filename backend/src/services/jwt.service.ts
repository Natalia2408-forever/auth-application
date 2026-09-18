import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { UserPayload } from '../types/user.js';

function getSecret(name: 'JWT_KEY' | 'JWT_REFRESH_KEY'): string {
  const secret = process.env[name];

  if (!secret) {
    throw new Error(`${name} must be set in .env`);
  }

  return secret;
}

function sign(user: UserPayload): string {
  return jwt.sign(user, getSecret('JWT_KEY'), { expiresIn: '20m' });
}

function signRefresh(user: UserPayload): string {
  return jwt.sign(user, getSecret('JWT_REFRESH_KEY'), { expiresIn: '30d' });
}

function verify(token: string): UserPayload | null {
  try {
    return jwt.verify(token, getSecret('JWT_KEY')) as UserPayload;
  } catch {
    return null;
  }
}

function verifyRefresh(token: string): UserPayload | null {
  try {
    return jwt.verify(token, getSecret('JWT_REFRESH_KEY')) as UserPayload;
  } catch {
    return null;
  }
}

export const jwtService = {
  sign,
  signRefresh,
  verify,
  verifyRefresh,
};
