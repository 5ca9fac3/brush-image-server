import { container } from '../../utils/dependencyInjection';

import { ImageController } from './image';
import { ImageProcessingController } from './imageProcessing';

const imageController: ImageController = container.resolve('imageController');
const imageProcessingController: ImageProcessingController = container.resolve('imageProcessingController');

export const v1Controllers = [imageController, imageProcessingController];
