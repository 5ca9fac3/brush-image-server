const JOB_TYPE = {
  // Job types
  storage: { name: 'storage', concurrency: 3 },
  upload: { name: 'upload', concurrency: 3 },
  updateRepo: { name: 'updateRepo', concurrency: 3 },
  updateS3: { name: 'updateS3', concurrency: 3 },
  download: { name: 'download', concurrency: 3 },

  rotate: { name: 'rotate', concurrency: 1 },
  resize: { name: 'resize', concurrency: 1 },
  crop: { name: 'crop', concurrency: 1 },
  grayscale: { name: 'grayscale', concurrency: 1 },
  tint: { name: 'tint', concurrency: 1 },
  blur: { name: 'blur', concurrency: 1 },
  sharpen: { name: 'sharpen', concurrency: 1 },
};

const formatTypes = ['png', 'jpg', 'jpeg', 'webp'];

module.exports = { JOB_TYPE, formatTypes };
