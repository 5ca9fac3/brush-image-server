const { JOB_TYPE } = require('../../constants');

module.exports = class ImageService {
  constructor({ imageRepository, s3Service, queueBackgroundJob, cacheService }) {
    this.imageRepository = imageRepository;
    this.s3Service = s3Service;
    this.cacheService = cacheService;
    this.queueBackgroundJob = queueBackgroundJob;
  }

  async upload(file) {
    try {
      const store = await this.s3Service.uploadImage(file);

      const image = await this.imageRepository.create({
        fileName: file.originalname,
        mimeType: file.mimetype,
        accessKey: store.Key,
        location: store.Location,
      });

      const imageData = {
        _id: image._id,
        mimeType: image.mimeType,
        fileName: image.fileName,
        accessKey: image.accessKey,
        location: image.location,
        buffer: file.buffer.toString('base64'),
      };

      this.queueBackgroundJob.add(JOB_TYPE.upload.name, { imageData }, { removeOnComplete: true, removeOnFail: true });
      this.queueBackgroundJob.process(JOB_TYPE.upload.name, JOB_TYPE.upload.concurrency, (job) =>
        this.cacheService.setImage(job.data.imageData)
      );

      return { publicId: image._id };
    } catch (error) {
      error.meta = { ...error.meta, 'imageService.upload': { file } };
      throw error;
    }
  }

  async updateProcessedImage(imageData) {
    try {
      const updatedData = [
        {
          $set: {
            processType: imageData.processType,
          },
        },
      ];

      await this.imageRepository.update(imageData._id, updatedData);

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageService.updateProcessedImage': { imageData } };
      throw error;
    }
  }
};
