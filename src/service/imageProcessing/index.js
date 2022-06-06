const createError = require('http-errors');
const sharp = require('sharp');
const { JOB_TYPE } = require('../../constants');
const { isValidFormatType } = require('../../helpers/imageProcessor');

module.exports = class ImageProcessingService {
  constructor({ cacheService, s3Service, imageService, queueBackgroundJob }) {
    this.cacheService = cacheService;
    this.s3Service = s3Service;
    this.queueBackgroundJob = queueBackgroundJob;
    this.imageService = imageService;
  }

  /**
   * @description Gets the image data from the cache
   * @param {String} imageId
   * @returns {Object} image
   */
  async getImageData(imageId) {
    try {
      const imageData = await this.cacheService.getImage(imageId);

      return imageData;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.getImageData': { imageId } };
      throw error;
    }
  }

  /**
   * @description Gets the meta data of the image
   * @param {Object} image
   * @returns {Object} metaData
   */
  async metaData(image) {
    try {
      const metaData = await sharp(image).metadata();

      return metaData;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.metaData': { image } };
      throw error;
    }
  }

  /**
   * @description Resizes the image
   * @param {String} publicId
   * @param {Number} width
   * @param {Number} height
   * @returns {Void} void
   */
  async resize(publicId, width, height) {
    try {
      const image = await this.getImageData(publicId);

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      if (width === 0) {
        width = metaData.width;
      }

      if (height === 0) {
        height = metaData.height;
      }

      if (width > metaData.width) {
        throw createError(422, 'Width is too large');
      }

      if (height > metaData.height) {
        throw createError(422, 'Height is too large');
      }

      const resizedBuffer = await sharp(buffer).resize(width, height).toFormat(metaData.format).toBuffer();

      const imageData = {
        ...image,
        buffer: resizedBuffer,
      };

      const imageDataWithBufferString = {
        ...image,
        processType: JOB_TYPE.resize.name,
        buffer: resizedBuffer.toString('base64'),
      };

      this.queueBackgroundJob.add(JOB_TYPE.resize.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.resize.name, JOB_TYPE.resize.concurrency, (job, done) => {
        this.cacheService.setImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateS3.name, { imageData });
      this.queueBackgroundJob.process(JOB_TYPE.updateS3.name, JOB_TYPE.updateS3.concurrency, (job, done) => {
        this.s3Service.updateImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateRepo.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.updateRepo.name, JOB_TYPE.updateRepo.concurrency, (job, done) => {
        this.imageService.updateProcessedImage(job.data.imageData);
        done();
      });

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.resize': { publicId, width, height } };
      throw error;
    }
  }

  /**
   * @description Crops the image
   * @param {String} publicId
   * @param {Object} dimensions
   * @returns {Void} void
   */
  async crop(publicId, dimensions) {
    try {
      const image = await this.getImageData(publicId);

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      if (dimensions.width === 0) {
        dimensions.width = metaData.width;
      }

      if (dimensions.height === 0) {
        dimensions.height = metaData.height;
      }

      if (dimensions.left + dimensions.width > metaData.width) {
        throw createError(422, 'Crop width is too large');
      }

      if (dimensions.top + dimensions.height > metaData.height) {
        throw createError(422, 'Crop height is too large');
      }

      const croppedBuffer = await sharp(file.path).extract(dimensions).toFormat(metaData.format).toBuffer();

      const imageData = {
        ...image,
        buffer: croppedBuffer,
      };

      const imageDataWithBufferString = {
        ...image,
        processType: JOB_TYPE.crop.name,
        buffer: croppedBuffer.toString('base64'),
      };

      this.queueBackgroundJob.add(JOB_TYPE.crop.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.crop.name, JOB_TYPE.crop.concurrency, (job, done) => {
        this.cacheService.setImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateS3.name, { imageData });
      this.queueBackgroundJob.process(JOB_TYPE.updateS3.name, JOB_TYPE.updateS3.concurrency, (job, done) => {
        this.s3Service.updateImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateRepo.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.updateRepo.name, JOB_TYPE.updateRepo.concurrency, (job, done) => {
        this.imageService.updateProcessedImage(job.data.imageData);
        done();
      });

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.crop': { publicId, dimensions } };
      throw error;
    }
  }

  /**
   * @description Grayscales the image
   * @param {String} publicId
   * @returns {Void} void
   */
  async grayscale(publicId) {
    try {
      const image = await this.getImageData(publicId);

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      const grayscaledBuffer = await sharp(buffer).grayscale(true).toFormat(metaData.format).toBuffer();

      const imageData = {
        ...image,
        buffer: grayscaledBuffer,
      };

      const imageDataWithBufferString = {
        ...image,
        processType: JOB_TYPE.grayscale.name,
        buffer: grayscaledBuffer.toString('base64'),
      };

      this.queueBackgroundJob.add(JOB_TYPE.grayscale.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.grayscale.name, JOB_TYPE.grayscale.concurrency, (job, done) => {
        this.cacheService.setImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateS3.name, { imageData });
      this.queueBackgroundJob.process(JOB_TYPE.updateS3.name, JOB_TYPE.updateS3.concurrency, (job, done) => {
        this.s3Service.updateImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateRepo.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.updateRepo.name, JOB_TYPE.updateRepo.concurrency, (job, done) => {
        this.imageService.updateProcessedImage(job.data.imageData);
        done();
      });

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.grayscale': { publicId } };
      throw error;
    }
  }

  /**
   * @description Applies Tint to the image
   * @param {String} publicId
   * @param {Object} tintColor
   * @returns {Void} void
   */
  async tint(publicId, tintColor) {
    try {
      const image = await this.getImageData(publicId);

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      const tintOptions = { r: tintColor.red, g: tintColor.green, b: tintColor.blue };

      const tintedBuffer = await sharp(buffer).tint(tintOptions).toFormat(metaData.format).toBuffer();

      const imageData = {
        ...image,
        buffer: tintedBuffer,
      };

      const imageDataWithBufferString = {
        ...image,
        processType: JOB_TYPE.tint.name,
        buffer: tintedBuffer.toString('base64'),
      };

      this.queueBackgroundJob.add(JOB_TYPE.tint.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.tint.name, JOB_TYPE.tint.concurrency, (job, done) => {
        this.cacheService.setImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateS3.name, { imageData });
      this.queueBackgroundJob.process(JOB_TYPE.updateS3.name, JOB_TYPE.updateS3.concurrency, (job, done) => {
        this.s3Service.updateImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateRepo.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.updateRepo.name, JOB_TYPE.updateRepo.concurrency, (job, done) => {
        this.imageService.updateProcessedImage(job.data.imageData);
        done();
      });

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.tint': { publicId, tintColor } };
      throw error;
    }
  }

  /**
   * @description Rotates the image
   * @param {String} publicId
   * @param {Number} angle
   * @returns {Void} void
   */
  async rotate(publicId, angle) {
    try {
      const image = await this.getImageData(publicId);

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      if (angle === 0) {
        throw createError(422, 'Angle must be greater than 0');
      }

      const rotatedBuffer = await sharp(buffer).rotate(angle).toFormat(metaData.format).toBuffer();

      const imageData = {
        ...image,
        buffer: rotatedBuffer,
      };

      const imageDataWithBufferString = {
        ...image,
        processType: JOB_TYPE.rotate.name,
        buffer: rotatedBuffer.toString('base64'),
      };

      this.queueBackgroundJob.add(JOB_TYPE.rotate.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.rotate.name, JOB_TYPE.rotate.concurrency, (job, done) => {
        this.cacheService.setImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateS3.name, { imageData });
      this.queueBackgroundJob.process(JOB_TYPE.updateS3.name, JOB_TYPE.updateS3.concurrency, (job, done) => {
        this.s3Service.updateImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateRepo.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.updateRepo.name, JOB_TYPE.updateRepo.concurrency, (job, done) => {
        this.imageService.updateProcessedImage(job.data.imageData);
        done();
      });

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.rotate': { publicId, angle } };
      throw error;
    }
  }

  /**
   * @description Applies Blur to the image
   * @param {String} publicId
   * @param {Number} blurPoint
   * @returns {Void} void
   */
  async blur(publicId, blurPoint) {
    try {
      const image = await this.getImageData(publicId);

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      if (!blurPoint) {
        throw createError(422, 'Blur point must be greater than 0');
      }

      const blurredBuffer = await sharp(buffer).blur(blurPoint).toFormat(metaData.format).toBuffer();

      const imageData = {
        ...image,
        buffer: blurredBuffer,
      };

      const imageDataWithBufferString = {
        ...image,
        processType: JOB_TYPE.blur.name,
        buffer: blurredBuffer.toString('base64'),
      };

      this.queueBackgroundJob.add(JOB_TYPE.blur.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.blur.name, JOB_TYPE.blur.concurrency, (job, done) => {
        this.cacheService.setImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateS3.name, { imageData });
      this.queueBackgroundJob.process(JOB_TYPE.updateS3.name, JOB_TYPE.updateS3.concurrency, (job, done) => {
        this.s3Service.updateImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateRepo.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.updateRepo.name, JOB_TYPE.updateRepo.concurrency, (job, done) => {
        this.imageService.updateProcessedImage(job.data.imageData);
        done();
      });

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.blur': { publicId, blurPoint } };
      throw error;
    }
  }

  /**
   * @description Sharpens the image
   * @param {String} publicId
   * @param {String} watermark
   * @returns {Void} void
   */
  async sharpen(publicId, sharpenPoint) {
    try {
      const image = await this.getImageData(publicId);

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      if (!sharpenPoint) {
        throw createError(422, 'Sharpen point must be greater than 0');
      }

      const sharpenedBuffer = await sharp(buffer).sharpen(sharpenPoint).toFormat(metaData.format).toBuffer();

      const imageData = {
        ...image,
        buffer: sharpenedBuffer,
      };

      const imageDataWithBufferString = {
        ...image,
        processType: JOB_TYPE.sharpen.name,
        buffer: sharpenedBuffer.toString('base64'),
      };

      this.queueBackgroundJob.add(JOB_TYPE.sharpen.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.sharpen.name, JOB_TYPE.sharpen.concurrency, (job, done) => {
        this.cacheService.setImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateS3.name, { imageData });
      this.queueBackgroundJob.process(JOB_TYPE.updateS3.name, JOB_TYPE.updateS3.concurrency, (job, done) => {
        this.s3Service.updateImage(job.data.imageData);
        done();
      });

      this.queueBackgroundJob.add(JOB_TYPE.updateRepo.name, { imageData: imageDataWithBufferString });
      this.queueBackgroundJob.process(JOB_TYPE.updateRepo.name, JOB_TYPE.updateRepo.concurrency, (job, done) => {
        this.imageService.updateProcessedImage(job.data.imageData);
        done();
      });

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.sharpen': { publicId, sharpenPoint } };
      throw error;
    }
  }

  /**
   * @description Formats the image to a new image format
   * @param {String} publicId 
   * @param {String} formatType 
   * @returns {Void} void
   */
  async format(publicId, formatType) {
    try {
      const image = await this.getImageData(publicId);

      const buffer = Buffer.from(image.buffer, 'base64');

      if (!formatType) {
        throw createError(422, 'Format type must be provided');
      }

      if (!isValidFormatType(formatType)) {
        throw createError(422, 'Invalid format type');
      }

      const formattedBuffer = await sharp(buffer).toFormat(formatType).toBuffer();

      const file = {
        originalname: `${image.fileName.split('.')[0]}.${formatType}`,
        mimetype: `image/${formatType}`,
        buffer: formattedBuffer,
      };

      const result = await this.imageService.upload(file);

      return result;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.format': { publicId, formatType } };
      throw error;
    }
  }
};
