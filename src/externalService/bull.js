const Queue = require('bull');

const { redisOptions } = require('./redis');

const QueueBackgroundJob = new Queue('backgroundJobs', { redis: redisOptions });

module.exports = { QueueBackgroundJob };
