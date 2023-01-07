import { Multer } from 'multer';

import { container } from '../utils/dependencyInjection';

import { ImageService } from './image';
import { ImageProcessingService } from './imageProcessing';

export const uploadImage: Multer = container.resolve('uploadImage');

export const imageService: ImageService = container.resolve('imageService');
export const imageProcessingService: ImageProcessingService = container.resolve('imageProcessingService');
