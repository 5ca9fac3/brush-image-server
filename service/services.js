const { container } = require('../externalService/dependencyInjection');

const uploadImage = container.resolve('uploadImage');

const imageService = container.resolve('imageService');
const imageProcessingService = container.resolve('imageProcessingService');

module.exports = {
  imageService,
  imageProcessingService,
  uploadImage,
};
