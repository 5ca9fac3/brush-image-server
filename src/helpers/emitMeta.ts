import { socket } from '..';

import { UploadResponse } from '../types';
import { imageWorkerEvent } from '../backgroundJobs/imageThreads';
import { workers } from '../constants';

export const emitMeta = () => {
  imageWorkerEvent.on(workers.EMIT_DATA, (meta: UploadResponse) => {
    socket.emit(meta.data.publicId, meta);
  });
  return socket;
};
