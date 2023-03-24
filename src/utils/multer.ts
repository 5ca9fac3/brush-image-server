import { Request } from 'express';
import multer, { FileFilterCallback, Multer } from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadImage: Multer = multer({ storage, fileFilter });
