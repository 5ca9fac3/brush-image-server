import Redis from 'ioredis';

export const options = { port: +process.env.REDIS_PORT, host: process.env.REDIS_HOST };

const redis = new Redis(options);

export const RedisClient = (): Redis => {
  const client = redis;

  client.on('connect', () => {
    console.log('Connected to Redis...');
  });

  client.on('error', (error) => {
    console.log(error);
  });

  return client;
};
