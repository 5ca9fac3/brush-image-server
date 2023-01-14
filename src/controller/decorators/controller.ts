import 'reflect-metadata';

import { Metadata } from '../types/metadata';

export const Controller = (prefix: string = '') => {
  return (target: any) => {
    Reflect.defineMetadata(Metadata.prefix, prefix, target);

    if (!Reflect.hasMetadata(Metadata.routes, target)) {
      Reflect.defineMetadata(Metadata.routes, [], target);
    }
  };
};
