import 'reflect-metadata';

import { RequestHandler } from 'express';

import { Metadata } from '../types/metadata';

const _middlewareBinder = (handlerType: string, handler: RequestHandler) => {
  return (target: any, key: string): void => {
    const handlers = Reflect.getMetadata(handlerType, target.constructor, key) || [];
    Reflect.defineMetadata(Metadata.middleware, [...handlers, handler], target.constructor, key);
  };
};

export const Use = (handler: RequestHandler) => _middlewareBinder(Metadata.middleware, handler);
