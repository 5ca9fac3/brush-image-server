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
    const resp = await imageService.download(req.params.publicId);

    return res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

export const undo = async (req: Request, res: Response) => {
  try {
    const resp = await imageService.undo(req.params.publicId);

    return res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

export const redo = async (req: Request, res: Response) => {
  try {
    const resp = await imageService.redo(req.params.publicId);

    return res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};
