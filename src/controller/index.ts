import { Express, NextFunction, Request, Response } from 'express';

import { RouteDefinition } from './types/routeDefinition';
import { RequestBody } from './types/requestBody';
import { Metadata } from './types/metadata';

import { response } from '../error/response';
import { HttpError } from '../interfaces/network/httpError';

import { v1Controllers } from './v1';

const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).send(response(err));
};

const noRoutesMatched = (req: Request, res: Response, next: NextFunction) => {
  if (!req.route) {
    const error = new Error('No route matched') as HttpError;
    error.status = 404;
    return next(error);
  }
  return next();
};

const Controllers = Object.freeze([...v1Controllers]);

export const _init = (app: Express) => {
  Controllers.forEach((controller) => {
    const prefix = Reflect.getMetadata(Metadata.prefix, controller);
    const routes: Array<RouteDefinition> = Reflect.getMetadata(Metadata.routes, controller);

    if (routes?.length) {
      routes.forEach((route) => {
        const middlewares = Reflect.getMetadata(Metadata.middleware, controller, route.methodName) || [];
        app[route.requestMethod](`${prefix}${route.path}`, middlewares, (req: RequestBody, res: Response) => {
          controller[route.methodName](req, res);
        });
      });
    }
  });
  app.use(noRoutesMatched);
  app.use(errorHandler);
};
