const { JOB_TYPE } = require('../../constants');

module.exports = class ImageService {
  constructor({ imageRepository, s3Service, queueBackgroundJob, cacheService }) {
    this.imageRepository = imageRepository;
    this.s3Service = s3Service;
    this.cacheService = cacheService;
    this.queueBackgroundJob = queueBackgroundJob;
  }

  /**
   * @description Uploads image to S3 bucket and info to databse
   * @param {Object} file 
   * @returns {Object} { publicId }
   */
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

      this.queueBackgroundJob.add(JOB_TYPE.upload.name, { imageData });
      this.queueBackgroundJob.process(JOB_TYPE.upload.name, JOB_TYPE.upload.concurrency, (job, done) => {
        this.cacheService.setImage(job.data.imageData);
        done();
      });

      return { publicId: image._id };
    } catch (error) {
      error.meta = { ...error.meta, 'imageService.upload': { file } };
      throw error;
    }
  }

  /**
   * @description Downloads the image from S3 bucket
   * @param {String} publicId 
   * @param {Response} res 
   * @returns {Void} void
   */
  async download(publicId, res) {
    try {
      const image = await this.imageRepository.findById(publicId);

      this.queueBackgroundJob.add(JOB_TYPE.download.name, { image });
      this.queueBackgroundJob.process(JOB_TYPE.download.name, JOB_TYPE.download.concurrency, (job, done) => {
        this.s3Service.retrieveImage(job.data.image, res);
        done();
      });

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageService.download': { publicId, res } };
      throw error;
    }
  }

  /**
   * @description Updates the database info with processed type
   * @param {Object} imageData 
   * @returns {Void} void
   */
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
