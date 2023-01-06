import express from 'express';
export const imageRoute = express.Router();

import { uploadFile, downloadFile } from './image';

import { uploadImage } from '../../../service/services';

imageRoute.post('/upload', uploadImage.single('file'), uploadFile);

imageRoute.post('/download/:publicId', downloadFile);
