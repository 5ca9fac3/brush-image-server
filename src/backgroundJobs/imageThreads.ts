import EventEmitter from 'events';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

import { process as workerProcess } from '../constants';
import { imageProcessingService } from '../service/services';
import { workers } from '../constants';

export const imageWorkerEvent = new EventEmitter();

if (isMainThread) {
  imageWorkerEvent.on(workers.PROCESS_IMAGE, (meta) => {
    const fileName = `${process.cwd()}/dist/backgroundJobs/imageThreads.js`;
    const worker = new Worker(fileName, { workerData: meta.data });

    worker.on('message', (meta) => {
      imageWorkerEvent.emit(workers.EMIT_DATA, meta);
    });

    worker.on('error', (error) => {
      console.log(error);
    });
  });
} else {
  (async () => {
    let response;
    switch (workerData.imageProcess) {
      case workerProcess.blur:
        response = await imageProcessingService.blur(workerData);
        break;
      case workerProcess.crop:
        response = await imageProcessingService.crop(workerData);
        break;
      case workerProcess.format:
        response = await imageProcessingService.format(workerData);
        break;
      case workerProcess.grayscale:
        response = await imageProcessingService.grayscale(workerData);
        break;
      case workerProcess.resize:
        response = await imageProcessingService.resize(workerData);
        break;
      case workerProcess.rotate:
        response = await imageProcessingService.rotate(workerData);
        break;
      case workerProcess.sharpen:
        response = await imageProcessingService.sharpen(workerData);
        break;
      case workerProcess.tint:
        response = await imageProcessingService.tint(workerData);
        break;
      default:
        break;
    }
    parentPort.postMessage(response);
  })();
}
