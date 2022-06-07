const Queue = require('bull');

const { redisOptions } = require('./redis');
const { JOB_TYPE } = require('../constants');

const jobOptions = { redis: redisOptions, settings: { lockDuration: 10000 } };

Queue.prototype.setHandler = async function (name, handler) {
  if (!this.handlers[name]) {
    this.handlers[name] = handler;
  }
};

const QueueBackgroundJob = new Queue('backgroundJobs', jobOptions);

const runBackgroundJobs = async ({ name, meta, className, jobToProcess, res = null }) => {
  QueueBackgroundJob.add(name, meta);
  QueueBackgroundJob.process(name, JOB_TYPE[name].concurrency, async (job) => {
    await setImmediate(() => jobToProcess.bind(className).call(this, job.data, res));
    return Promise.resolve();
  });
};

module.exports = { QueueBackgroundJob, runBackgroundJobs };
