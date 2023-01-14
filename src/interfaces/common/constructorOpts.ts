import EventEmitter from 'events';
import { Multer } from 'multer';
import { Redis } from 'ioredis';

import { CacheService } from '../../service/cache';
import { ImageService } from '../../service/image';
import { ImageProcessingService } from '../../service/imageProcessing';

export interface ConstructorOpts {
  cacheService?: CacheService;
  cache?: Redis;
  imageService?: ImageService;
  imageProcessingService?: ImageProcessingService;
  queueEvent?: EventEmitter;
  uploadImage?: Multer;
}
