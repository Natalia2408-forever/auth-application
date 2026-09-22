import express from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { catchError } from '../utils/catchError.js';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { passport, enabledOAuthProviders } from '../config/passport.js';
import { OAuthProvider } from '../types/user.js';

function makeLimiter(limit: number): RateLimitRequestHandler {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts, please try again later' },
  });
}

const registrationLimiter = makeLimiter(20);
const loginLimiter = makeLimiter(20);
const refreshLimiter = makeLimiter(60);

export const authRouter = express.Router();

authRouter.post(
  '/registration',
  registrationLimiter,
  catchError(authController.register),
);

authRouter.post('/login', loginLimiter, catchError(authController.login));
authRouter.get('/refresh', refreshLimiter, catchError(authController.refresh));

authRouter.post('/logout', authMiddleware, catchError(authController.logout));

function registerOAuthRoutes(provider: OAuthProvider, scope: string[]): void {
  if (!enabledOAuthProviders[provider]) {
    authRouter.get(`/auth/${provider}`, (req, res) => {
      res.redirect(
        `${process.env.CLIENT_APP_URL}/#/login?error=${provider}_not_configured`,
      );
    });

    return;
  }

  authRouter.get(
    `/auth/${provider}`,
    passport.authenticate(provider, { scope, session: false }),
  );

  authRouter.get(
    `/auth/${provider}/callback`,
    passport.authenticate(provider, {
      session: false,
      failureRedirect: `${process.env.CLIENT_APP_URL}/#/login`,
    }),
    catchError(authController.oauthCallback),
  );
}

registerOAuthRoutes('google', ['profile', 'email']);
registerOAuthRoutes('github', ['user:email']);
