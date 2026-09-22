import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { ApiError } from '../exceptions/api.error.js';
import { userService } from '../services/user.service.js';
import { jwtService } from '../services/jwt.service.js';
import { tokenService } from '../services/token.service.js';
import {
  normalizeEmail,
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/validators.js';
import { UserPayload } from '../types/user.js';

type TokensResult = {
  user: UserPayload;
  accessToken: string;
};

function readString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

async function generateTokens(
  res: Response,
  user: UserPayload,
): Promise<TokensResult> {
  const normalizedUser = userService.normalize(user);
  const accessToken = jwtService.sign(normalizedUser);
  const refreshToken = jwtService.signRefresh(normalizedUser);

  await tokenService.save(normalizedUser.id, refreshToken);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: 'none',
  });

  return { user: normalizedUser, accessToken };
}

const register = async (req: Request, res: Response): Promise<void> => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const name = readString(body.name);
  const email = readString(body.email);
  const password = readString(body.password);

  const errors = {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (
    errors.name ||
    errors.email ||
    errors.password ||
    !name ||
    !email ||
    !password
  ) {
    throw ApiError.badRequest('Validation failed', errors);
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await userService.register(name.trim(), normalizeEmail(email), hashedPass);

  res.send({ message: 'Registration successful. You can now log in.' });
};

const login = async (req: Request, res: Response): Promise<void> => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const email = readString(body.email);
  const password = readString(body.password);

  if (!email || !password) {
    throw ApiError.badRequest('Invalid email or password');
  }

  const user = await userService.findByEmail(normalizeEmail(email));

  const isPasswordValid = user?.password
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!user || !isPasswordValid) {
    throw ApiError.badRequest('Invalid email or password');
  }

  const data = await generateTokens(res, user);

  res.send(data);
};

const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.cookies;

  if (!refreshToken || typeof refreshToken !== 'string') {
    throw ApiError.unauthorized();
  }

  const userData = jwtService.verifyRefresh(refreshToken);
  const token = await tokenService.getByToken(refreshToken);

  if (!userData || !token) {
    throw ApiError.unauthorized();
  }

  const user = await userService.findById(userData.id);

  if (!user) {
    throw ApiError.unauthorized();
  }

  const data = await generateTokens(res, user);

  res.send(data);
};

const logout = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.cookies;

  if (!refreshToken || typeof refreshToken !== 'string') {
    throw ApiError.unauthorized();
  }

  const userData = jwtService.verifyRefresh(refreshToken);

  if (userData) {
    await tokenService.remove(userData.id);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.sendStatus(204);
};

const oauthCallback = async (req: Request, res: Response): Promise<void> => {
  const currentUser = req.user as UserPayload | undefined;

  if (!currentUser) {
    throw ApiError.unauthorized();
  }

  const { accessToken } = await generateTokens(res, currentUser);

  res.redirect(
    `${process.env.CLIENT_APP_URL}/#/oauth-success?accessToken=${accessToken}`,
  );
};

export const authController = {
  register,
  login,
  refresh,
  logout,
  oauthCallback,
};
