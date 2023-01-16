import { parentPort, workerData } from 'worker_threads';

import { process } from '../constants';
import { imageProcessingService } from '../service/services';

(async () => {
  let response;
  console.log(`🚀 ~ file: processImage.ts:9 ~ workerData`, workerData);
  switch (workerData.imageProcess) {
    case process.resize:
      response = await imageProcessingService.resize(workerData);
      break;
    default:
      break;
  }
  parentPort.postMessage(response);
})();
