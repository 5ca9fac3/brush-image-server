import { CacheService } from './cache';
import { ImageService } from './image';
import { ImageEditingService } from './imageEditing';
import { ImageProcessingService } from './imageProcessing';

export const services = Object.freeze({
  cacheService: CacheService,
  imageService: ImageService,
  imageProcessingService: ImageProcessingService,
  imageEditingService: ImageEditingService,
});
