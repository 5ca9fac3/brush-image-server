import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../../interfaces/network/httpError';

export const noRoutesMatched = (req: Request, res: Response, next: NextFunction) => {
  if (!req.route) {
    const error = new Error('No route matched') as HttpError;
    error.status = 404;
    return next(error);
  }
  return next();
};
