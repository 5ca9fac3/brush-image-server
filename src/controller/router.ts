import express, { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

import { v1Routes } from './v1/v1Routes';
import { HttpError } from '../interfaces/network/httpError';
import { response } from '../error/response';

const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).send(response(err));
};

export const router = (app: express.Express): void => {
  const apiRoutes = express.Router();

  apiRoutes.use('/v1', v1Routes);

  apiRoutes.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.route) {
      const error = createError(404, 'No route matched');
      return next(error);
    }

    return next();
  });

  app.use('/api', apiRoutes);

  app.use('/', errorHandler);
};
