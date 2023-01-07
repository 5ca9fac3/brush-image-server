import fs from 'fs';
import { v4 as uuid } from 'uuid';

import { JOB_TYPE } from '../../constants';

import { CacheService } from '../cache';
import { UpdateImage } from '../../interfaces/schema/updateImage';
import { UploadResponse } from '../../interfaces/service/image/uploadResponse';
import { General } from '../../interfaces/service/common/general';
import { FileType } from '../../interfaces/service/image/fileType';

interface ImageServiceOpts {
  cacheService: CacheService;
  runBackgroundJobs: Function;
}

export class ImageService {
  cacheService: CacheService;
  runBackgroundJobs: Function;

  constructor(opts: ImageServiceOpts) {
    this.cacheService = opts.cacheService;
    this.runBackgroundJobs = opts.runBackgroundJobs;
  }

  async upload(file: Express.Multer.File | FileType): Promise<UploadResponse> {
    try {
      const imageData = {
        _id: uuid(),
        mimeType: file.mimetype,
        fileName: file.originalname,
        buffer: file.buffer.toString('base64'),
      };

      this.runBackgroundJobs({
        name: JOB_TYPE.upload.name,
        meta: imageData,
        className: this.cacheService,
        jobToProcess: this.cacheService.setImage,
      });

      return { success: true, message: 'Uploaded image successfully', data: { publicId: imageData._id } };
    } catch (error) {
      // TODO: logger to implemeted
      // TODO: Rollbacks
      error.meta = { ...error.meta, 'imageService.upload': { file } };
      throw error;
    }
  }

  async download(publicId: string): Promise<General> {
    try {
      const image = await this.cacheService.getImage(publicId);

      const directory = process.cwd().split('src')[0];
      const fileName = `${directory}/tmp/${image.processType || 'original'}-${uuid()}.${image.mimeType.split('/')[1]}`;

      const buffer = Buffer.from(image.buffer, 'base64');

      await fs.writeFileSync(fileName, buffer);

      return { success: true, message: 'Downloaded image successfully' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageService.download': { publicId } };
      throw error;
    }
  }

  async updateProcessedImage(imageData: UpdateImage): Promise<void> {
    try {
      this.runBackgroundJobs({
        name: JOB_TYPE.upload.name,
        meta: imageData,
        className: this.cacheService,
        jobToProcess: this.cacheService.setImage,
      });

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageService.updateProcessedImage': { imageData } };
      throw error;
    }
  }
}
