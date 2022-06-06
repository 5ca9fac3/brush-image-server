const express = require('express');
const imageProcessingRoute = express.Router();

const imageProcessing = require('./imageProcessing');

imageProcessingRoute.post('/resize/:publicId', imageProcessing.resize);

imageProcessingRoute.post('/crop/:publicId', imageProcessing.crop);

imageProcessingRoute.post('/grayscale/:publicId', imageProcessing.grayscale);

imageProcessingRoute.post('/tint/:publicId', imageProcessing.tint);

imageProcessingRoute.post('/rotate/:publicId', imageProcessing.rotate);

imageProcessingRoute.post('/blur/:publicId', imageProcessing.blur);

imageProcessingRoute.post('/sharpen/:publicId', imageProcessing.sharpen);

module.exports = { imageProcessingRoute };
