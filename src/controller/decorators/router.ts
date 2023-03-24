import 'reflect-metadata';

import { Metadata } from '../types/metadata';
import { RequestMethod } from '../types/requestMethod';
import { RouteDefinition } from '../types/routeDefinition';

const _routeBinder = (path: string, method: RequestMethod) => {
  return (target: any, key: string): void => {
    if (!Reflect.hasMetadata(Metadata.routes, target.constructor)) {
      Reflect.defineMetadata(Metadata.routes, [], target.constructor);
    }

    const routes = Reflect.getMetadata(Metadata.routes, target.constructor) as Array<RouteDefinition>;

    routes.push({
      path,
      methodName: key,
      requestMethod: method,
    });
    Reflect.defineMetadata(Metadata.routes, routes, target.constructor);
  };
};

export const Get = (path: string) => _routeBinder(path, RequestMethod.get);
export const Post = (path: string) => _routeBinder(path, RequestMethod.post);
export const Put = (path: string) => _routeBinder(path, RequestMethod.put);
export const Patch = (path: string) => _routeBinder(path, RequestMethod.patch);
export const Delete = (path: string) => _routeBinder(path, RequestMethod.delete);
