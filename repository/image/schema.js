const Schema = require('mongoose').Schema;

const ImageSchema = new Schema({
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

module.exports = (mongoDb) => {
  return mongoDb.model('Image', ImageSchema);
};
