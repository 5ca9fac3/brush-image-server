export const JOB = {
  cacheStorage: { name: 'cacheStorage', concurrency: 3 },
  download: { name: 'download', concurrency: 3 },
};

export const formatTypes = ['png', 'jpg', 'jpeg', 'webp'];

export const event = {
  BACKGROUND_JOB: 'backgroundJobs',
  PROCESS: 'process',
};

export const workers = {
  RESIZE_WORKER: 'RESIZE_WORKER',
};

export const process = {
  original: 'original',
  rotate: 'rotate',
  resize: 'resize',
  crop: 'crop',
  grayscale: 'grayscale',
  tint: 'tint',
  blur: 'blur',
  sharpen: 'sharpen',
  format: 'format',
};
