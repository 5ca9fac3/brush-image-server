const { container } = require('../externalService/dependencyInjection');

const uploadImage = container.resolve('uploadImage');

const imageService = container.resolve('imageService');
const cacheService = container.resolve('cacheService');
const imageProcessingService = container.resolve('imageProcessingService');

module.exports = {
  imageService,
  cacheService,
  imageProcessingService,
  uploadImage,
};
