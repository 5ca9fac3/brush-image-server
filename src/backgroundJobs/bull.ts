import EventEmitter from 'events';
import BullQueue, { Queue } from 'bull';

import { options } from '../utils/redis';
import { JOB, event } from '../constants';

import { cacheService } from '../service/services';

export const queueEvent = new EventEmitter();

const jobOptions = { redis: options, settings: { lockDuration: 10000 } };

/* Creating a new queue for each job.\ and add the job to the queue */
queueEvent.on(event.BACKGROUND_JOB, (name: string, meta: Object) => {
  const queueJob = new BullQueue(`${event.BACKGROUND_JOB}_${name}`, jobOptions);

  try {
    queueJob.add(name, meta);
  } catch (error) {
    console.log(error);
    return;
  }

  queueEvent.emit(`${event.PROCESS}_${name}`, queueJob);
});

/* 
  Below are the events that Process the job added to the queue
*/

queueEvent.on(`${event.PROCESS}_${JOB.upload.name}`, (queueJob: Queue) => {
  queueJob.process(JOB.upload.name, JOB.upload.concurrency, async (job) => {
    await setImmediate(async () => {
      await cacheService.setData(job.data.storage);
    });
    return Promise.resolve();
  });
});

queueEvent.on(`${event.PROCESS}_${JOB.updateStorage.name}`, (queueJob: Queue) => {
  queueJob.process(JOB.updateStorage.name, JOB.updateStorage.concurrency, async (job) => {
    await setImmediate(async () => {
      await cacheService.setData(job.data.storage);
    });
    return Promise.resolve();
  });
});
