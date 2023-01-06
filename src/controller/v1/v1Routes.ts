import express from 'express';

import { imageRoute } from './image/routes';
import { imageProcessingRoute } from './imageProcessing/routes';

export const v1Routes = express.Router();

v1Routes.use('/image', imageRoute);

v1Routes.use('/process-image', imageProcessingRoute);
