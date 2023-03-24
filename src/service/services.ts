import { Multer } from 'multer';

import { container } from '../utils/dependencyInjection';

import { CacheService } from './cache';
import { ImageService } from './image';
import { ImageProcessingService } from './imageProcessing';
import { ImageEditingService } from './imageEditing';

export const uploadImage: Multer = container.resolve('uploadImage');

export const cacheService: CacheService = container.resolve('cacheService');
export const imageService: ImageService = container.resolve('imageService');
export const imageProcessingService: ImageProcessingService = container.resolve('imageProcessingService');
export const imageEditingService: ImageEditingService = container.resolve('imageEditingService');
