import express from 'express';
import { catchError } from '../utils/catchError.js';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { passport, enabledOAuthProviders } from '../config/passport.js';

export const authRouter = new express.Router();

authRouter.post('/registration', catchError(authController.register));

authRouter.post('/login', catchError(authController.login));
authRouter.get('/refresh', catchError(authController.refresh));
authRouter.post('/logout', authMiddleware, catchError(authController.logout));

function registerOAuthRoutes(provider, scope) {
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
registerOAuthRoutes('facebook', ['email']);
registerOAuthRoutes('github', ['user:email']);
