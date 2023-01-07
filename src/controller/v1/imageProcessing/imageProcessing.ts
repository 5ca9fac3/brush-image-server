import { Request, Response } from 'express';

import { response } from '../../../error/response';
import { imageProcessingService } from '../../../service/services';

export const resize = async (req: Request, res: Response) => {
  try {
    const { width = 0, height = 0 } = req.body || {};

    const resp = await imageProcessingService.resize(req.params.publicId, +width, +height);

    res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

export const crop = async (req: Request, res: Response) => {
  try {
    const { left = 0, top = 0, width = 0, height = 0 } = req.body || {};
    const dimensions = { left: +left, top: +top, width: +width, height: +height };

    const resp = await imageProcessingService.crop(req.params.publicId, dimensions);

    res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

export const grayscale = async (req: Request, res: Response) => {
  try {
    const resp = await imageProcessingService.grayscale(req.params.publicId);

    res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

export const tint = async (req: Request, res: Response) => {
  try {
    const { red = 0, green = 0, blue = 0 } = req.body || {};
    const tintColor = { red: +red, green: +green, blue: +blue };

    const resp = await imageProcessingService.tint(req.params.publicId, tintColor);

    res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

export const rotate = async (req: Request, res: Response) => {
  try {
    const { angle = 0 } = req.body;

    const resp = await imageProcessingService.rotate(req.params.publicId, +angle);

    res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

export const blur = async (req: Request, res: Response) => {
  try {
    const { blurPoint = 0 } = req.body;

    const resp = await imageProcessingService.blur(req.params.publicId, +blurPoint);

    res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

export const sharpen = async (req: Request, res: Response) => {
  try {
    const { sharpenPoint = 0 } = req.body;

    const resp = await imageProcessingService.sharpen(req.params.publicId, +sharpenPoint);

    res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

export const format = async (req: Request, res: Response) => {
  try {
    const { formatType = null } = req.body;

    const resp = await imageProcessingService.format(req.params.publicId, formatType);

    res.status(200).json(resp);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};
