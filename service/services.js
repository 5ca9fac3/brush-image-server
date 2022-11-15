const { container } = require('../utils/dependencyInjection');

const uploadImage = container.resolve('uploadImage');

const imageService = container.resolve('imageService');
const imageProcessingService = container.resolve('imageProcessingService');

module.exports = {
  imageService,
  imageProcessingService,
  uploadImage,
};
