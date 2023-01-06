import mongoose from 'mongoose';

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

export const ImageSchema = (mongoDb) => {
  return mongoDb.model('Image', Schema);
};
