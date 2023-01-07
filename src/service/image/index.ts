import { JOB_TYPE } from '../../constants';

import { ImageRepository } from '../../repository/image';
import { CacheService } from '../cache';
import { S3Service } from '../s3';
import { UpdateImage } from '../../interfaces/repository/image/updateImage';
import { UploadResponse } from '../../interfaces/service/image/uploadResponse';
import { General } from '../../interfaces/service/common/general';
import { ObjectId } from 'mongoose';
import { FileType } from '../../interfaces/service/image/fileType';

interface ImageServiceOpts {
  imageRepository: ImageRepository;
  s3Service: S3Service;
  cacheService: CacheService;
  runBackgroundJobs: Function;
}

export class ImageService {
  imageRepository: ImageRepository;
  s3Service: S3Service;
  cacheService: CacheService;
  runBackgroundJobs: Function;

  constructor(opts: ImageServiceOpts) {
    this.imageRepository = opts.imageRepository;
    this.s3Service = opts.s3Service;
    this.cacheService = opts.cacheService;
    this.runBackgroundJobs = opts.runBackgroundJobs;
  }

  async upload(file: Express.Multer.File | FileType): Promise<UploadResponse> {
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

      return { success: true, message: 'Uploaded image successfully', data: { publicId: image._id } };
    } catch (error) {
      // TODO: logger to implemeted
      // TODO: Rollbacks
      error.meta = { ...error.meta, 'imageService.upload': { file } };
      throw error;
    }
  }

  async download(publicId: ObjectId): Promise<General> {
    try {
      const image = await this.imageRepository.findById(publicId);

      this.runBackgroundJobs({
        name: JOB_TYPE.download.name,
        meta: image,
        className: this.s3Service,
        jobToProcess: this.s3Service.retrieveImage,
      });

      return { success: true, message: 'Downloaded image successfully' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageService.download': { publicId } };
      throw error;
    }
  }

  async updateProcessedImage(imageData: UpdateImage): Promise<void> {
    try {
      await this.imageRepository.update(imageData._id, imageData);

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageService.updateProcessedImage': { imageData } };
      throw error;
    }
  }
}
