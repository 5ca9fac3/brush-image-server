const { JOB_TYPE } = require('../../constants');

module.exports = class ImageService {
  constructor({ imageRepository, s3Service, runBackgroundJobs, cacheService }) {
    this.imageRepository = imageRepository;
    this.s3Service = s3Service;
    this.cacheService = cacheService;
    this.runBackgroundJobs = runBackgroundJobs;
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

      this.runBackgroundJobs({
        name: JOB_TYPE.upload.name,
        meta: imageData,
        className: this.cacheService,
        jobToProcess: this.cacheService.setImage,
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

      this.runBackgroundJobs({
        name: JOB_TYPE.download.name,
        meta: image,
        className: this.s3Service,
        jobToProcess: this.s3Service.retrieveImage,
        res,
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
