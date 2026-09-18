import { ApiError } from '../exeptions/api.error.js';
import bcrypt from 'bcrypt';
import { userService } from '../services/user.service.js';
import { jwtService } from '../services/jwt.service.js';
import { tokenService } from '../services/token.service.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

async function generateTokens(res, user) {
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

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) {
    throw ApiError.badRequest('Name is required');
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.email || errors.password) {
    throw ApiError.badRequest('Validation failed', errors);
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await userService.register(name, email, hashedPass);
  res.send({ message: 'Registration successful. You can now log in.' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.findByEmail(email);

  const isPasswordValid = user?.password
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!isPasswordValid) {
    throw ApiError.badRequest('Invalid email or password');
  }

  const data = await generateTokens(res, user);

  res.send(data);
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw ApiError.unauthorized();
  }
  const userData = await jwtService.verifyRefresh(refreshToken);
  const token = await tokenService.getByToken(refreshToken);

  if (!userData || !token) {
    throw ApiError.unauthorized();
  }

  const user = await userService.findById(userData.id);
  const data = await generateTokens(res, user);

  res.send(data);
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw ApiError.unauthorized();
  }

  const userData = await jwtService.verifyRefresh(refreshToken);

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

const oauthCallback = async (req, res) => {
  const { accessToken } = await generateTokens(res, req.user);

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

