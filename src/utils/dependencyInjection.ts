import { Lifetime, createContainer, asValue, asClass, AwilixContainer } from 'awilix';
import { Redis } from 'ioredis';

import { uploadImage } from './multer';
import { RedisClient } from './redis';
import { queueEvent, runBackgroundJobs } from './bull';

import { services } from '../service';

const redis: Redis = RedisClient();

const Container = (): AwilixContainer => {
  const container = createContainer({ injectionMode: 'PROXY' });

  container.register('uploadImage', asValue(uploadImage));
  container.register('runBackgroundJobs', asValue(runBackgroundJobs));
  container.register('cache', asValue(redis));
  container.register('queueEvent', asValue(queueEvent));

  /* Registering all the services in the container. */
  Object.keys(services).forEach((service) => {
    container.register(service, asClass(services[service], { lifetime: Lifetime.SINGLETON }));
  });

  return container;
};

export const container: AwilixContainer = Container();
