import { Lifetime, createContainer, asValue, asClass, AwilixContainer } from 'awilix';

import { uploadImage } from './multer';
import { RedisClient } from './redis';
import { queueEvent } from '../backgroundJobs/bull';
import { imageWorkerEvent } from '../backgroundJobs/imageThreads';

import { services } from '../service';

const redis = RedisClient();

const Container = (): AwilixContainer => {
  const container = createContainer({ injectionMode: 'PROXY' });

  container.register('uploadImage', asValue(uploadImage));
  container.register('cache', asValue(redis));
  container.register('queueEvent', asValue(queueEvent));
  container.register('imageWorkerEvent', asValue(imageWorkerEvent));

  /* Registering all the services in the container. */
  Object.keys(services).forEach((service) => {
    container.register(service, asClass(services[service], { lifetime: Lifetime.SINGLETON }));
  });

  return container;
};

export const container: AwilixContainer = Container();
