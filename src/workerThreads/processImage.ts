import { parentPort, workerData } from 'worker_threads';

import { process } from '../constants';
import { imageProcessingService } from '../service/services';

(async () => {
  let response;
  switch (workerData.imageProcess) {
    case process.blur:
      response = await imageProcessingService.blur(workerData);
      break;
    case process.crop:
      response = await imageProcessingService.crop(workerData);
      break;
    case process.format:
      response = await imageProcessingService.format(workerData);
      break;
    case process.grayscale:
      response = await imageProcessingService.grayscale(workerData);
      break;
    case process.resize:
      response = await imageProcessingService.resize(workerData);
      break;
    case process.rotate:
      response = await imageProcessingService.rotate(workerData);
      break;
    case process.sharpen:
      response = await imageProcessingService.sharpen(workerData);
      break;
    case process.tint:
      response = await imageProcessingService.tint(workerData);
      break;
    default:
      break;
  }
  parentPort.postMessage(response);
})();
