import { ObjectId } from 'mongoose';
import { Request, Response } from 'express';

import { response } from '../../../error/response';
import { imageService } from '../../../service/services';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const resp = await imageService.upload(req.file);

    res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const resp = await imageService.download(req.params.publicId as unknown as ObjectId);

    return res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};
