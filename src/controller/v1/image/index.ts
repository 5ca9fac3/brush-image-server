import { Request, Response } from 'express';

import { response } from '../../../error/response';

import { Controller } from '../../decorators/controller';
import { Post, Put } from '../../decorators/router';
import { Use } from '../../decorators/middleware';

import { imageService, uploadImage } from '../../../service/services';

@Controller('/v1/image')
export class ImageController {
  @Post('/upload')
  @Use(uploadImage.single('file'))
  public async uploadFile(req: Request, res: Response) {
    try {
      const resp = await imageService.upload(req.file);

      res.status(200).json(resp);
    } catch (error) {
      res.status(error.status || 500).json(response(error));
    }
  }

  @Post('/download/:publicId')
  public async downloadFile(req: Request, res: Response) {
    try {
      const resp = await imageService.download(req.params.publicId);

      return res.status(200).json(resp);
    } catch (error) {
      res.status(error.status || 500).json(response(error));
    }
  }

  @Put('/undo/:publicId')
  public async undo(req: Request, res: Response) {
    try {
      const resp = await imageService.undo(req.params.publicId);

      return res.status(200).json(resp);
    } catch (error) {
      res.status(error.status || 500).json(response(error));
    }
  }

  @Put('/redo/:publicId')
  public async redo(req: Request, res: Response) {
    try {
      const resp = await imageService.redo(req.params.publicId);

      return res.status(200).json(resp);
    } catch (error) {
      res.status(error.status || 500).json(response(error));
    }
  }
}
