const uuid = require('uuid').v4;

module.exports = class S3Service {
  constructor({ s3Object }) {
    this.s3Object = s3Object;
  }

  /**
   * @description Uploads an image to S3
   * @param {Object} file
   * @returns {Object} S3 response
   */
  async uploadImage(file) {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}-${file.originalname}`,
        Body: file.buffer,
      };

      const result = await this.s3Object.upload(params).promise();

      return result;
    } catch (error) {
      error.meta = { ...error.meta, 's3Service.uploadImage': { file } };
      throw error;
    }
  }

  /**
   * @description Downloads an image from S3
   * @param {Object} image
   * @param {Response} res
   * @returns {Void} void
   */
  async retrieveImage(image, res) {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${image.accessKey}`,
      };

      res.attachment(`${image.processType || 'original'}-${image.accessKey}`);
      const fileStream = this.s3Object.getObject(params).createReadStream();
      fileStream.pipe(res);
    } catch (error) {
      error.meta = { ...error.meta, 's3Service.retrieveImage': { image, res } };
      throw error;
    }
  }

  /**
   * @description Updates the image in S3
   * @param {Object} image 
   * @returns {Object} { success }
   */
  async updateImage(image) {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${image.accessKey}`,
        Body: Buffer.from(image.buffer.data),
        ContentType: image.mimeType,
      };

      await this.s3Object.putObject(params).promise();

      return { success: true };
    } catch (error) {
      error.meta = { ...error.meta, 's3Service.updateImage': { image } };
      throw error;
    }
  }
};
