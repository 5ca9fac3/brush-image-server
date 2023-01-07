import { Model, ObjectId } from 'mongoose';

import { ImageSchema } from './schema';
import { IImage } from '../../interfaces/mongo/imageModel';
import { MongooseConnection } from '../../interfaces/utils/mongoConnection';
import { Image } from '../../interfaces/schema/image';
import { UpdateImage } from '../../interfaces/repository/image/updateImage';

interface ImageRepositoryOpts {
  imageDb: MongooseConnection;
}

export class ImageRepository {
  repository: typeof Model<IImage>;

  constructor(opts: ImageRepositoryOpts) {
    this.repository = ImageSchema(opts.imageDb);
  }

  async create(data: Image): Promise<Image> {
    try {
      const image = await this.repository.create(data);

      return image;
    } catch (error) {
      error.meta = { ...error.meta, 'ImageRepository.create': { data } };
      throw error;
    }
  }

  async findById(id: ObjectId): Promise<Image> {
    try {
      const image = await this.repository.findById(id);

      return image;
    } catch (error) {
      error.meta = { ...error.meta, 'ImageRepository.findById': { id } };
      throw error;
    }
  }

  async update(id: ObjectId, data: UpdateImage): Promise<void> {
    try {
      const updatedData = [
        {
          $set: {
            processType: data.processType,
          },
        },
      ];
      await this.repository.updateOne({ _id: id }, updatedData);

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'ImageRepository.update': { id, data } };
      throw error;
    }
  }
}
