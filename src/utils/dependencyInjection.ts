import { Lifetime, createContainer, asValue, asClass, AwilixContainer } from 'awilix';
import { Redis } from 'ioredis';

import { mongoDb } from './mongoDb';
import { uploadImage } from './multer';
import { RedisClient } from './redis';
import { runBackgroundJobs } from './bull';
import { s3 } from './s3';

import { repositories } from '../repository';
import { services } from '../service';

const redis = RedisClient();

const Container = (): AwilixContainer => {
  const container = createContainer({ injectionMode: 'PROXY' });

  container.register('mongoDb', asValue(mongoDb));
  container.register('uploadImage', asValue(uploadImage));
  container.register('runBackgroundJobs', asValue(runBackgroundJobs));
  container.register('cache', asValue(redis));
  container.register('s3Object', asValue(s3));

  /* Registering all the models in the container. */
  Object.keys(repositories).forEach((repository) => {
    container.register(repository, asClass(repositories[repository], { lifetime: Lifetime.SINGLETON }));
  });

  /* Registering all the services in the container. */
  Object.keys(services).forEach((service) => {
    container.register(service, asClass(services[service], { lifetime: Lifetime.SINGLETON }));
  });

  return container;
};

export const container: AwilixContainer = Container();
