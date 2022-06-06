const Queue = require('bull');

const { redisOptions } = require('./redis');

const jobOptions = { redis: redisOptions, settings: { lockDuration: 10000 } };

const QueueBackgroundJob = new Queue('backgroundJobs', jobOptions);

module.exports = { QueueBackgroundJob };
