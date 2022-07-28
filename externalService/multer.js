const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/**
 * @description Uploads an image to memory.
 */
const uploadImage = multer({ storage, fileFilter });

module.exports = { uploadImage };
