import { ApiError } from '../exeptions/api.error.js';
import bcrypt from 'bcrypt';
import { userService } from '../services/user.service.js';
import { jwtService } from '../services/jwt.service.js';
import { tokenService } from '../services/token.service.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import { facebookAuthCache } from '../utils/facebookAuthCache.js';

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
  const { user, accessToken } = await generateTokens(res, req.user);

  const { code } = req.query;

  if (code) {
    facebookAuthCache.setUserId(code, user.id);
  }

  res.redirect(
    `${process.env.CLIENT_APP_URL}/#/oauth-success?accessToken=${accessToken}`,
  );
};

// Called from the facebookCallbackGuard middleware when a Facebook `code`
// has already been used once. Instead of rejecting the duplicate request,
// we issue a fresh session (cookie + accessToken) for the same user, so
// whichever of the two requests actually reaches the user's browser works.
const reissueFacebookSession = async (req, res) => {
  const { code } = req.query;
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
