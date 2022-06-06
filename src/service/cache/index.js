module.exports = class CacheService {
  constructor({ cache }) {
    this.cache = cache;
  }

  async setImage(image) {
    try {
      await this.cache.hset(`${image._id}`, image);

      return { success: true };
    } catch (error) {
      error.meta = { ...error.meta, 'cacheService.setImage': { image } };
      throw error;
    }
  }

  async getImage(imageId) {
    try {
      const value = await this.cache.hgetall(`${imageId}`);

      return value;
    } catch (error) {
      error.meta = { ...error.meta, 'cacheService.getImage': { imageId } };
      throw error;
    }
  }
};
