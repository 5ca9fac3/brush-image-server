const ImageSchema = require('./schema');

module.exports = class ImageRepository {
  constructor({ mongoDb }) {
    this.repository = ImageSchema(mongoDb);
  }

  /**
   * @description Create new image
   * @param {Object} data
   * @returns {Object} { id, fileName, mimeType, accessKey, location }
   */
  async create(data) {
    try {
      const image = await this.repository.create(data);

      return image;
    } catch (error) {
      error.meta = { ...error.meta, 'ImageRepository.create': { data } };
      throw error;
    }
  }

  /**
   * @description Find image by id
   * @param {ObjectId} id
   * @returns {Object} { id, fileName, mimeType, accessKey, location }
   */
  async findById(id) {
    try {
      const image = await this.repository.findById(id);

      return image;
    } catch (error) {
      error.meta = { ...error.meta, 'ImageRepository.findById': { id } };
      throw error;
    }
  }

  /**
   * @description Update image by id
   * @param {ObjectId} id
   * @returns {Void} void
   */
  async update(id, data) {
    try {
      await this.repository.updateOne({ _id: id }, data);

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'ImageRepository.update': { id, data } };
      throw error;
    }
  }
};
