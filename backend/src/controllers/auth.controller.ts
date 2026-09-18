import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { ApiError } from '../exeptions/api.error.js';
import { userService } from '../services/user.service.js';
import { jwtService } from '../services/jwt.service.js';
import { tokenService } from '../services/token.service.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import { facebookAuthCache } from '../utils/facebookAuthCache.js';
import { UserPayload } from '../types/user.js';

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

type TokensResult = {
  user: UserPayload;
  accessToken: string;
};

function readCode(req: Request): string | null {
  return typeof req.query.code === 'string' ? req.query.code : null;
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
  const { name, email, password } = req.body as RegisterBody;

  if (!name) {
    throw ApiError.badRequest('Name is required');
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.email || errors.password || !email || !password) {
    throw ApiError.badRequest('Validation failed', errors);
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await userService.register(name, email, hashedPass);
  res.send({ message: 'Registration successful. You can now log in.' });
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginBody;

  if (!email || !password) {
    throw ApiError.badRequest('Invalid email or password');
  }

  const user = await userService.findByEmail(email);

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

  const { user, accessToken } = await generateTokens(res, currentUser);

  const code = readCode(req);

  if (code) {
    facebookAuthCache.setUserId(code, user.id);
  }

  res.redirect(
    `${process.env.CLIENT_APP_URL}/#/oauth-success?accessToken=${accessToken}`,
  );
};

const reissueFacebookSession = async (
  req: Request,
  res: Response,
): Promise<boolean> => {
  const code = readCode(req);
  const cachedUserId = code ? facebookAuthCache.getUserId(code) : null;

  if (!cachedUserId) {
    return false;
  }

  const user = await userService.findById(cachedUserId);

  if (!user) {
    return false;
  }

  const { accessToken } = await generateTokens(res, user);

  res.redirect(
    `${process.env.CLIENT_APP_URL}/#/oauth-success?accessToken=${accessToken}`,
  );

  return true;
};

export const authController = {
  register,
  login,
  refresh,
  logout,
  oauthCallback,
  reissueFacebookSession,
};
