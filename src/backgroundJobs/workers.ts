import EventEmitter from 'events';
import { Worker } from 'worker_threads';

import { process as imageProcess, workers } from '../constants';

export const workerEvent = new EventEmitter();

workerEvent.on(workers.RESIZE_WORKER, (meta) => {
  const fileName = `${process.cwd()}/dist/workerThreads/${imageProcess.resize}.js`;
  const worker = new Worker(fileName, { workerData: meta.data });
  worker.on('message', (data) => {
    console.log(`🚀 ~ file: workers.ts:12 ~ worker.on ~ data`, data);
  });
});
