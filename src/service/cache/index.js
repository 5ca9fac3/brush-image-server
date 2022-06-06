module.exports = class CacheService {
  constructor({ cache }) {
    this.cache = cache;
  }

  /**
   * @description Sets the image in the cache
   * @param {Object} image 
   * @returns {Object} { success }
   */
  async setImage(image) {
    try {
      await this.cache.hset(`${image._id}`, image);

      return { success: true };
    } catch (error) {
      error.meta = { ...error.meta, 'cacheService.setImage': { image } };
      throw error;
    }
  }

  /**
   * @description Gets the image from the cache
   * @param {String} imageId 
   * @returns {Object} { image }
   */
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
