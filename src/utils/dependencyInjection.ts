import { Lifetime, createContainer, asValue, asClass, AwilixContainer } from 'awilix';
import { Redis } from 'ioredis';

import { connectToDB } from './mongoDb';
import { uploadImage } from './multer';
import { RedisClient } from './redis';
import { runBackgroundJobs } from './bull';
import { s3 } from './s3';

import { repositories } from '../repository';
import { services } from '../service';

import { database } from '../constants';
import { MongooseConnection } from '../interfaces/utils/mongoConnection';

const redis: Redis = RedisClient();
const imageDb: MongooseConnection = connectToDB(database.PROG_IMG);

const Container = (): AwilixContainer => {
  const container = createContainer({ injectionMode: 'PROXY' });

  container.register('imageDb', asValue(imageDb));
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
