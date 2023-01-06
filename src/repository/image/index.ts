import { ImageSchema } from './schema';

export class ImageRepository {
  repository: any;

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

  async findById(id) {
    try {
      const image = await this.repository.findById(id);

      return image;
    } catch (error) {
      error.meta = { ...error.meta, 'ImageRepository.findById': { id } };
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
}
