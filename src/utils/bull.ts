import Queue from 'bull';

import { options } from './redis';
import { JOB_TYPE } from '../constants';

const jobOptions = { redis: options, settings: { lockDuration: 10000 } };

export const runBackgroundJobs = async ({ name, meta, className, jobToProcess }) => {
  const QueueBackgroundJob = new Queue(`backgroundJobs_${name}`, jobOptions);

  QueueBackgroundJob.add(name, meta);
  QueueBackgroundJob.process(name, JOB_TYPE[name].concurrency, async (job) => {
    await setImmediate(() => jobToProcess.bind(className).call(this, job.data));
    return Promise.resolve();
  });
};
