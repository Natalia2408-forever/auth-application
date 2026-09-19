import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/api.error.js';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  console.error(error);

  if (error instanceof ApiError) {
    res.status(error.status).send({
      message: error.message,
      errors: error.errors,
    });

    return;
  }

  res.status(500).send({
    message: 'Server error',
  });
};
