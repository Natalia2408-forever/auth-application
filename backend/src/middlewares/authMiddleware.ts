import { NextFunction, Response } from 'express';
import { jwtService } from '../services/jwt.service.js';
import { AuthRequest } from '../types/user.js';

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authorization = req.headers['authorization'] || '';
  const [, token] = authorization.split(' ');

  if (!authorization || !token) {
    res.sendStatus(401);

    return;
  }

  const userData = jwtService.verify(token);

  if (!userData) {
    res.sendStatus(401);

    return;
  }

  req.userId = userData.id;
  next();
};
