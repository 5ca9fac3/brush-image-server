import { parentPort, workerData } from 'worker_threads';

import { imageProcessingService } from '../service/services';

(async () => {
  const response = await imageProcessingService.resize(workerData);
  parentPort.postMessage(response);
})();
