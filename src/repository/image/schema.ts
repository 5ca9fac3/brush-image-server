import mongoose, { Model } from 'mongoose';

import { MongooseConnection } from '../../interfaces/utils/mongoConnection';
import { IImage } from '../../interfaces/mongo/imageModel';

const Schema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  accessKey: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

export const ImageSchema = (mongoDb: MongooseConnection): typeof Model<IImage> => {
  return mongoDb.model<IImage>('Image', Schema);
};
