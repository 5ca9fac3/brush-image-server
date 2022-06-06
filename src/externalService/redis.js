const Redis = require('ioredis');

const options = { port: 6379, host: process.env.REDIS_URL, db: 0 };

const redis = new Redis(options);

const RedisClient = () => {
  const client = redis;

  client.on('connect', () => {
    console.log('Connected to Redis...');
  });

  client.on('error', (error) => {
    console.log(error);
  });

  return client;
};

module.exports = { redis: RedisClient(), redisOptions: options };
