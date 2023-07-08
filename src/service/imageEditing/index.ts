import createError from 'http-errors';
import sharp, { AvailableFormatInfo, FormatEnum, Region } from 'sharp';
import EventEmitter from 'events';

import { process, workers } from '../../constants';
import { isValidFormatType } from '../../helpers/imageProcessor';
import { CacheService } from '../cache';
import { Storage, ConstructorOpts, General, ProcessorParams, TintColor, Image } from '../../types';

export class ImageEditingService {
  cacheService: CacheService;
  imageWorkerEvent: EventEmitter;

  constructor(opts: ConstructorOpts) {
    this.cacheService = opts.cacheService;
    this.imageWorkerEvent = opts.imageWorkerEvent;
  }

  async getImageData(storageId: string): Promise<Storage> {
    try {
      const data = (await this.cacheService.getData(storageId)) as unknown as Storage;

      return data;
    } catch (error) {
      error.meta = { ...error.meta, 'imageEditing.getImageData': { storageId } };
      throw error;
    }
  }

  async metaData(image: Buffer): Promise<sharp.Metadata> {
    try {
      const metaData = await sharp(image).metadata();

      return metaData;
    } catch (error) {
      error.meta = { ...error.meta, 'imageEditing.metaData': { image } };
      throw error;
    }
  }

  getImage(storage: Storage): Image {
    try {
      const effect = storage.effects[storage.effectsIdx];
      const image = storage.effectsApplied[effect];
      return image;
    } catch (error) {
      error.meta = { ...error.meta, 'imageEditing.getImage': { storage } };
      throw error;
    }
  }

  async resize(publicId: string, width: number, height: number): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);
      const image = this.getImage(storage);

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      if (width === 0) {
        width = metaData.width;
      }

      if (height === 0) {
        height = metaData.height;
      }

      if (width > metaData.width) {
        throw createError(422, 'Width is too large');
      }

      if (height > metaData.height) {
        throw createError(422, 'Height is too large');
      }

      const data: ProcessorParams = { options: { width, height }, storage, publicId, imageProcess: process.resize };
      this.imageWorkerEvent.emit(workers.PROCESS_IMAGE, { data });

      return { success: true, message: 'Image will be resized' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageEditing.resize': { publicId, width, height } };
      throw error;
    }
  }

  async crop(publicId: string, dimension: Region): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);
      const image = this.getImage(storage);

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      if (dimension.width === 0) {
        dimension.width = metaData.width;
      }

      if (dimension.height === 0) {
        dimension.height = metaData.height;
      }

      if (dimension.left + dimension.width > metaData.width) {
        throw createError(422, 'Crop width is too large');
      }

      if (dimension.top + dimension.height > metaData.height) {
        throw createError(422, 'Crop height is too large');
      }

      const data = { options: { dimension }, storage, publicId, imageProcess: process.crop };
      this.imageWorkerEvent.emit(workers.PROCESS_IMAGE, { data });

      return { success: true, message: 'Image will be cropped' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageEditing.crop': { publicId, dimension } };
      throw error;
    }
  }

  async grayscale(publicId: string): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);

      const data = { options: {}, storage, publicId, imageProcess: process.grayscale };
      this.imageWorkerEvent.emit(workers.PROCESS_IMAGE, { data });

      return { success: true, message: 'Image will be grayscaled' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageEditing.grayscale': { publicId } };
      throw error;
    }
  }

  async tint(publicId: string, tintColor: TintColor): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);

      const tintOptions = { r: tintColor.red, g: tintColor.green, b: tintColor.blue };

      const data = { options: { tintOptions }, storage, publicId, imageProcess: process.tint };
      this.imageWorkerEvent.emit(workers.PROCESS_IMAGE, { data });

      return { success: true, message: 'Image will be tinted' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageEditing.tint': { publicId, tintColor } };
      throw error;
    }
  }

  async rotate(publicId: string, angle: number): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);

      if (angle === 0) {
        throw createError(422, 'Angle must be greater than 0');
      }

      const data = { options: { angle }, storage, publicId, imageProcess: process.rotate };
      this.imageWorkerEvent.emit(workers.PROCESS_IMAGE, { data });

      return { success: true, message: 'Image will be rotated' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageEditing.rotate': { publicId, angle } };
      throw error;
    }
  }

  async blur(publicId: string, blurPoint: number): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);

      if (!blurPoint) {
        throw createError(422, 'Blur point must be greater than 0');
      }

      const data = { options: { blurPoint }, storage, publicId, imageProcess: process.blur };
      this.imageWorkerEvent.emit(workers.PROCESS_IMAGE, { data });

      return { success: true, message: 'Image will be blurred' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageEditing.blur': { publicId, blurPoint } };
      throw error;
    }
  }

  async sharpen(publicId: string, sharpenPoint: number): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);

      if (!sharpenPoint) {
        throw createError(422, 'Sharpen point must be greater than 0');
      }

      const data = { options: { sharpenPoint }, storage, publicId, imageProcess: process.sharpen };
      this.imageWorkerEvent.emit(workers.PROCESS_IMAGE, { data });

      return { success: true, message: 'Image will be sharpened' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageEditing.sharpen': { publicId, sharpenPoint } };
      throw error;
    }
  }

  async format(publicId: string, formatType: keyof FormatEnum | AvailableFormatInfo): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);

      if (!formatType) {
        throw createError(422, 'Format type must be provided');
      }

      if (!isValidFormatType(formatType as unknown as string)) {
        throw createError(422, 'Invalid format type');
      }

      const data = { options: { formatType }, storage, publicId, imageProcess: process.format };
      this.imageWorkerEvent.emit(workers.PROCESS_IMAGE, { data });

      return { success: true, message: `Image formatted to ${formatType}` };
    } catch (error) {
      error.meta = { ...error.meta, 'imageEditing.format': { publicId, formatType } };
      throw error;
    }
  }
}
