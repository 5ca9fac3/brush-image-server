import fs from 'fs';
import { v4 as uuid } from 'uuid';

export class S3Service {
  s3Object: any;

  constructor({ s3Object }) {
    this.s3Object = s3Object;
  }

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

  async retrieveImage(image) {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${image.accessKey}`,
      };

      const { Body } = await this.s3Object.getObject(params).promise();

      const directory = process.cwd().split('src')[0];
      const fileName = `${directory}/tmp/${image.processType || 'original'}-${image.accessKey}`;

      await fs.writeFileSync(fileName, Body);

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 's3Service.retrieveImage': { image } };
      throw error;
    }
  }

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
}
