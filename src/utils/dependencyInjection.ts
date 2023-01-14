import { Lifetime, createContainer, asValue, asClass, AwilixContainer } from 'awilix';

import { uploadImage } from './multer';
import { RedisClient } from './redis';
import { queueEvent } from '../backgroundJobs/bull';

import { services } from '../service';
import { v1Controllers } from '../controller/v1/v1Controller';

const redis = RedisClient();

const Container = (): AwilixContainer => {
  const container = createContainer({ injectionMode: 'PROXY' });

  container.register('uploadImage', asValue(uploadImage));
  container.register('cache', asValue(redis));
  container.register('queueEvent', asValue(queueEvent));

  /* Registering all the services in the container. */
  Object.keys(services).forEach((service) => {
    container.register(service, asClass(services[service], { lifetime: Lifetime.SINGLETON }));
  });

  /* Registering all the v1 controllers in the container. */
  Object.keys(v1Controllers).forEach((controller) => {
    container.register(controller, asClass(v1Controllers[controller], { lifetime: Lifetime.SINGLETON }));
  });

  return container;
};

export const container: AwilixContainer = Container();
