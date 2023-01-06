import express from 'express';
import createError from 'http-errors';

import { v1Routes } from './v1/v1Routes';

export const router = (app) => {
  const apiRoutes = express.Router();

  apiRoutes.use('/v1', v1Routes);

  apiRoutes.use((req, res, next) => {
    if (!req.route) {
      const error = createError(404, 'No route matched');
      return next(error);
    }

    return next();
  });

  app.use('/api', apiRoutes);
};
