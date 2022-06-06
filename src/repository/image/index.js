const ImageSchema = require('./schema');

module.exports = class ImageRepository {
  constructor({ mongoDb }) {
    this.repository = ImageSchema(mongoDb);
  }

  async create(data) {
    try {
      const image = await this.repository.create(data);

      return image;
    } catch (error) {
      error.meta = { ...error.meta, 'ImageRepository.create': { data } };
      throw error;
    }
  }

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
