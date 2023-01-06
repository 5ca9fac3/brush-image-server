import { CacheService } from './cache';
import { ImageService } from './image';
import { ImageProcessingService } from './imageProcessing';
import { S3Service } from './s3';

export const services = Object.freeze({
  cacheService: CacheService,
  imageService: ImageService,
  imageProcessingService: ImageProcessingService,
  s3Service: S3Service,
});
