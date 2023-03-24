import { socket } from '..';

import { UploadResponse } from '../interfaces/service/image/uploadResponse';
import { workerEvent } from '../backgroundJobs/workers';
import { workers } from '../constants';

export const emitMeta = () => {
  workerEvent.on(workers.EMIT_DATA, (meta: UploadResponse) => {
    socket.emit(meta.data.publicId, meta);
  });
  return socket;
};