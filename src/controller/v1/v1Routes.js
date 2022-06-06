const express = require('express');

const { imageRoute } = require('./image/routes');
const { imageProcessingRoute } = require('./imageProcessing/routes');

const v1Routes = express.Router();

v1Routes.use('/image', imageRoute);

v1Routes.use('/process-image', imageProcessingRoute);

module.exports = v1Routes;
