import { container } from '../utils/dependencyInjection';

export const uploadImage = container.resolve('uploadImage');

export const imageService = container.resolve('imageService');
export const imageProcessingService = container.resolve('imageProcessingService');
