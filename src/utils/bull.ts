import Queue from 'bull';
import EventEmitter from 'events';

import { options } from './redis';
import { JOB_TYPE } from '../constants';

const jobOptions = { redis: options, settings: { lockDuration: 10000 } };

interface RunBackgroundJobsOptions {
  name: string;
  meta: Object;
  className: Function;
  jobToProcess: Function;
}

// interface RunBackgroundJobsV2Options {
//   name: string;
//   meta: Object;
//   className: string;
//   funcName: string;
// }

export const runBackgroundJobs = async ({ name, meta, className, jobToProcess }: RunBackgroundJobsOptions) => {
  const QueueBackgroundJob = new Queue(`backgroundJobs_${name}`, jobOptions);

  QueueBackgroundJob.add(name, meta);
  QueueBackgroundJob.process(name, JOB_TYPE[name].concurrency, async (job) => {
    await setImmediate(() => jobToProcess.bind(className).call(this, job.data));
    return Promise.resolve();
  });
};

// export const runBackgroundJobsV2 = async ({ name, meta, className, funcName }: RunBackgroundJobsV2Options) => {
//   const QueueBackgroundJob = new Queue(`backgroundJobs_${name}`, jobOptions);

//   QueueBackgroundJob.add(name, meta);
//   QueueBackgroundJob.process(name, JOB_TYPE[name].concurrency, async (job) => {
//     await setImmediate(() => jobToProcess.bind(className).call(this, job.data));
//     return Promise.resolve();
//   });
// };
export const queueEvent = new EventEmitter();

queueEvent.on('resized', (...rest) => {
  console.log(`🚀 ~ file: bull.ts:47 ~ queueEvent.on ~ rest`, rest);
});
