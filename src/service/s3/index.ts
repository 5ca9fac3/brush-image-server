import { S3 } from 'aws-sdk';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

import { Image } from '../../interfaces/schema/image';
import { FileType } from '../../interfaces/service/image/fileType';

interface S3ServiceOpts {
  s3Object: S3;
}
export class S3Service {
  s3Object: S3;

  constructor(opts: S3ServiceOpts) {
    this.s3Object = opts.s3Object;
  }

  async uploadImage(file: Express.Multer.File | FileType): Promise<S3.ManagedUpload.SendData> {
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

  async retrieveImage(image: Image): Promise<void> {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${image.accessKey}`,
      };

      const { Body } = await this.s3Object.getObject(params).promise();

      const directory = process.cwd().split('src')[0];
      const fileName = `${directory}/tmp/${image.processType || 'original'}-${image.accessKey}`;

      await fs.writeFileSync(fileName, Body as unknown as string);

      return;
    } catch (error) {
      error.meta = { ...error.meta, 's3Service.retrieveImage': { image } };
      throw error;
    }
  }

  async updateImage(image: Image): Promise<void> {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${image.accessKey}`,
        Body: Buffer.from(image.buffer.data),
        ContentType: image.mimeType,
      };

      await this.s3Object.putObject(params).promise();

      return;
    } catch (error) {
      error.meta = { ...error.meta, 's3Service.updateImage': { image } };
      throw error;
    }
  }
}
