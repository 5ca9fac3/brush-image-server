const express = require('express');
const imageRoute = express.Router();

const image = require('./image');

const { uploadImage } = require('../../../service/services');

imageRoute.post('/upload', uploadImage.single('file'), image.uploadFile);

module.exports = { imageRoute };
