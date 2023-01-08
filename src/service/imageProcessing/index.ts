import createError from 'http-errors';
import sharp, { AvailableFormatInfo, FormatEnum, RGBA, Region } from 'sharp';
import EventEmitter from 'events';

import { JOB, event, process } from '../../constants';
import { extractStorage, isValidFormatType } from '../../helpers/imageProcessor';
import { CacheService } from '../cache';
import { ImageService } from '../image';
import { TintColor } from '../../interfaces/service/image/tintColor';
import { General } from '../../interfaces/service/common/general';
import { Storage } from '../../interfaces/schema/storage';
import { ConstructorOpts } from '../../interfaces/common/constructorOpts';

export class ImageProcessingService {
  cacheService: CacheService;
  imageService: ImageService;
  queueEvent: EventEmitter;

  constructor(opts: ConstructorOpts) {
    this.cacheService = opts.cacheService;
    this.imageService = opts.imageService;
    this.queueEvent = opts.queueEvent;
  }

  async getImageData(storageId: string): Promise<Storage> {
    try {
      const data = (await this.cacheService.getData(storageId)) as unknown as Storage;

      return data;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.getImageData': { storageId } };
      throw error;
    }
  }

  async metaData(image: Buffer): Promise<sharp.Metadata> {
    try {
      const metaData = await sharp(image).metadata();

      return metaData;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.metaData': { image } };
      throw error;
    }
  }

  async resize(publicId: string, width: number, height: number): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);
      const image = storage.currentState;

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

      const resizedBuffer = await sharp(buffer).resize(width, height).toFormat(metaData.format).toBuffer();

      storage = extractStorage(storage, image, process.resize, resizedBuffer, { width, height });

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.updateStorage.name, { storage });

      return { success: true, message: 'Image is resized' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.resize': { publicId, width, height } };
      throw error;
    }
  }

  async crop(publicId: string, dimension: Region): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);
      const image = storage.currentState;

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

      const croppedBuffer = await sharp(buffer).extract(dimension).toFormat(metaData.format).toBuffer();

      storage = extractStorage(storage, image, process.crop, croppedBuffer, { dimension });

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.updateStorage.name, { storage });

      return { success: true, message: 'Image is cropped' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.crop': { publicId, dimension } };
      throw error;
    }
  }

  async grayscale(publicId: string): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);
      const image = storage.currentState;

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      const grayscaledBuffer = await sharp(buffer).grayscale(true).toFormat(metaData.format).toBuffer();

      storage = extractStorage(storage, image, process.grayscale, grayscaledBuffer, {});

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.updateStorage.name, { storage });

      return { success: true, message: 'Image is grayscaled' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.grayscale': { publicId } };
      throw error;
    }
  }

  async tint(publicId: string, tintColor: TintColor): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);
      const image = storage.currentState;

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      const tintOptions = { r: tintColor.red, g: tintColor.green, b: tintColor.blue };

      const tintedBuffer = await sharp(buffer)
        .tint(tintOptions as unknown as RGBA)
        .toFormat(metaData.format)
        .toBuffer();

      storage = extractStorage(storage, image, process.tint, tintedBuffer, { tintOptions });

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.updateStorage.name, { storage });

      return { success: true, message: 'Image is tinted' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.tint': { publicId, tintColor } };
      throw error;
    }
  }

  async rotate(publicId: string, angle: number): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);
      const image = storage.currentState;

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      if (angle === 0) {
        throw createError(422, 'Angle must be greater than 0');
      }

      const rotatedBuffer = await sharp(buffer).rotate(angle).toFormat(metaData.format).toBuffer();

      storage = extractStorage(storage, image, process.rotate, rotatedBuffer, { angle });

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.updateStorage.name, { storage });

      return { success: true, message: 'Image is rotated' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.rotate': { publicId, angle } };
      throw error;
    }
  }

  async blur(publicId: string, blurPoint: number): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);
      const image = storage.currentState;

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      if (!blurPoint) {
        throw createError(422, 'Blur point must be greater than 0');
      }

      const blurredBuffer = await sharp(buffer).blur(blurPoint).toFormat(metaData.format).toBuffer();

      storage = extractStorage(storage, image, process.blur, blurredBuffer, { blurPoint });

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.updateStorage.name, { storage });

      return { success: true, message: 'Image is blurred' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.blur': { publicId, blurPoint } };
      throw error;
    }
  }

  async sharpen(publicId: string, sharpenPoint: number): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);
      const image = storage.currentState;

      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      if (!sharpenPoint) {
        throw createError(422, 'Sharpen point must be greater than 0');
      }

      const sharpenedBuffer = await sharp(buffer).sharpen(sharpenPoint).toFormat(metaData.format).toBuffer();

      storage = extractStorage(storage, image, process.sharpen, sharpenedBuffer, { sharpenPoint });

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.updateStorage.name, { storage });

      return { success: true, message: 'Image is sharpened' };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.sharpen': { publicId, sharpenPoint } };
      throw error;
    }
  }

  async format(publicId: string, formatType: keyof FormatEnum | AvailableFormatInfo): Promise<General> {
    try {
      let storage = await this.getImageData(publicId);
      const image = storage.currentState;

      const buffer = Buffer.from(image.buffer, 'base64');

      if (!formatType) {
        throw createError(422, 'Format type must be provided');
      }

      if (!isValidFormatType(formatType as unknown as string)) {
        throw createError(422, 'Invalid format type');
      }

      const formattedBuffer = await sharp(buffer).toFormat(formatType).toBuffer();

      storage = extractStorage(storage, image, process.format, formattedBuffer, {
        formatType: formatType as unknown as string,
      });

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.updateStorage.name, { storage });

      return { success: true, message: `Image formatted to ${formatType}` };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.format': { publicId, formatType } };
      throw error;
    }
  }
}
