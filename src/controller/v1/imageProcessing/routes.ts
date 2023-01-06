import express from 'express';
export const imageProcessingRoute = express.Router();

import { blur, crop, format, grayscale, resize, rotate, sharpen, tint } from './imageProcessing';

imageProcessingRoute.post('/resize/:publicId', resize);

imageProcessingRoute.post('/crop/:publicId', crop);

imageProcessingRoute.post('/grayscale/:publicId', grayscale);

imageProcessingRoute.post('/tint/:publicId', tint);

imageProcessingRoute.post('/rotate/:publicId', rotate);

imageProcessingRoute.post('/blur/:publicId', blur);

imageProcessingRoute.post('/sharpen/:publicId', sharpen);

imageProcessingRoute.post('/format/:publicId', format);
