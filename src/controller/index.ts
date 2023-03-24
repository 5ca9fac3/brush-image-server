import { Express, Response } from 'express';

import { RouteDefinition } from './types/routeDefinition';
import { RequestBody } from './types/requestBody';
import { Metadata } from './types/metadata';

import { noRoutesMatched } from './helpers/noRoutesMatched';
import { errorHandler } from './helpers/errorHandler';

import { V1Controllers } from './v1';

const Controllers = Object.freeze([...V1Controllers]);

export const _init = (app: Express) => {
  Controllers.forEach((Controller) => {
    const prefix = Reflect.getMetadata(Metadata.prefix, Controller);
    const routes: Array<RouteDefinition> = Reflect.getMetadata(Metadata.routes, Controller);

    if (routes?.length) {
      routes.forEach((route) => {
        const middlewares = Reflect.getMetadata(Metadata.middleware, Controller, route.methodName) || [];
        app[route.requestMethod](`${prefix}${route.path}`, middlewares, (req: RequestBody, res: Response) => {
          const controller: any = new Controller();
          return controller[route.methodName](req, res);
        });
      });
    }
  });
  app.use(noRoutesMatched);
  app.use(errorHandler);
};
