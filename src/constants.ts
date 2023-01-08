export const JOB = {
  upload: { name: 'upload', concurrency: 3 },
  download: { name: 'download', concurrency: 3 },
  updateStorage: { name: 'updateStorage', concurrency: 3 },
};

export const formatTypes = ['png', 'jpg', 'jpeg', 'webp'];

export const event = {
  BACKGROUND_JOB: 'backgroundJobs',
  PROCESS: 'process',
};

export const process = {
  rotate: 'rotate',
  resize: 'resize',
  crop: 'crop',
  grayscale: 'grayscale',
  tint: 'tint',
  blur: 'blur',
  sharpen: 'sharpen',
  format: 'format',
};
