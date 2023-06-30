import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../../types/httpError';
import { response } from '../../error/response';

export const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).send(response(err));
};
