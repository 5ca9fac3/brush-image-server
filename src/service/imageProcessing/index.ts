import sharp, { RGBA } from 'sharp';
import EventEmitter from 'events';

import { JOB, event, process } from '../../constants';
import { extractStorage } from '../../helpers/imageProcessor';
import { CacheService } from '../cache';
import { ImageService } from '../image';
import { ConstructorOpts, UploadResponse, ProcessorParams, Image, Storage } from '../../types';

export class ImageProcessingService {
  cacheService: CacheService;
  imageService: ImageService;
  queueEvent: EventEmitter;

  constructor(opts: ConstructorOpts) {
    this.cacheService = opts.cacheService;
    this.imageService = opts.imageService;
    this.queueEvent = opts.queueEvent;
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

  getImage(storage: Storage): Image {
    try {
      const effect = storage.effects[storage.effectsIdx];
      const image = storage.effectsApplied[effect];

      return image;
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.getImage': { storage } };
      throw error;
    }
  }

  async resize({ storage, publicId, options }: ProcessorParams): Promise<UploadResponse> {
    try {
      const image = this.getImage(storage);
      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      const resizedBuffer = await sharp(buffer)
        .resize(options.width, options.height)
        .toFormat(metaData.format)
        .toBuffer();

      storage = extractStorage(storage, image, process.resize, resizedBuffer, options);

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.cacheStorage.name, { storage });

      return {
        data: { publicId },
        image: storage.effectsApplied[storage.effectsIdx],
        success: true,
        message: 'Image is resized',
      };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.resize': { storage, publicId, options } };
      throw error;
    }
  }

  async crop({ publicId, storage, options }: ProcessorParams): Promise<UploadResponse> {
    try {
      const image = this.getImage(storage);
      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      const croppedBuffer = await sharp(buffer).extract(options.dimension).toFormat(metaData.format).toBuffer();

      storage = extractStorage(storage, image, process.crop, croppedBuffer, options);

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.cacheStorage.name, { storage });

      return {
        data: { publicId },
        image: storage.effectsApplied[storage.effectsIdx],
        success: true,
        message: 'Image is cropped',
      };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.crop': { publicId, options } };
      throw error;
    }
  }

  async grayscale({ publicId, storage }: ProcessorParams): Promise<UploadResponse> {
    try {
      const image = this.getImage(storage);
      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      const grayscaledBuffer = await sharp(buffer).grayscale(true).toFormat(metaData.format).toBuffer();

      storage = extractStorage(storage, image, process.grayscale, grayscaledBuffer, {});

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.cacheStorage.name, { storage });

      return {
        data: { publicId },
        image: storage.effectsApplied[storage.effectsIdx],
        success: true,
        message: 'Image is grayscaled',
      };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.grayscale': { publicId } };
      throw error;
    }
  }

  async tint({ publicId, storage, options }: ProcessorParams): Promise<UploadResponse> {
    try {
      const image = this.getImage(storage);
      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      const tintedBuffer = await sharp(buffer)
        .tint(options.tintOptions as unknown as RGBA)
        .toFormat(metaData.format)
        .toBuffer();

      storage = extractStorage(storage, image, process.tint, tintedBuffer, options);

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.cacheStorage.name, { storage });

      return {
        data: { publicId },
        image: storage.effectsApplied[storage.effectsIdx],
        success: true,
        message: 'Image is tinted',
      };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.tint': { publicId, options } };
      throw error;
    }
  }

  async rotate({ publicId, storage, options }: ProcessorParams): Promise<UploadResponse> {
    try {
      const image = this.getImage(storage);
      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      const rotatedBuffer = await sharp(buffer).rotate(options.angle).toFormat(metaData.format).toBuffer();

      storage = extractStorage(storage, image, process.rotate, rotatedBuffer, options);

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.cacheStorage.name, { storage });

      return {
        data: { publicId },
        image: storage.effectsApplied[storage.effectsIdx],
        success: true,
        message: 'Image is rotated',
      };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.rotate': { publicId, options } };
      throw error;
    }
  }

  async blur({ publicId, storage, options }: ProcessorParams): Promise<UploadResponse> {
    try {
      const image = this.getImage(storage);
      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      const blurredBuffer = await sharp(buffer).blur(options.blurPoint).toFormat(metaData.format).toBuffer();

      storage = extractStorage(storage, image, process.blur, blurredBuffer, options);

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.cacheStorage.name, { storage });

      return {
        data: { publicId },
        image: storage.effectsApplied[storage.effectsIdx],
        success: true,
        message: 'Image is blurred',
      };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.blur': { publicId, options } };
      throw error;
    }
  }

  async sharpen({ publicId, storage, options }: ProcessorParams): Promise<UploadResponse> {
    try {
      const image = this.getImage(storage);
      const buffer = Buffer.from(image.buffer, 'base64');
      const metaData = await this.metaData(buffer);

      const sharpenedBuffer = await sharp(buffer).sharpen(options.sharpenPoint).toFormat(metaData.format).toBuffer();

      storage = extractStorage(storage, image, process.sharpen, sharpenedBuffer, options);

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.cacheStorage.name, { storage });

      return {
        data: { publicId },
        image: storage.effectsApplied[storage.effectsIdx],
        success: true,
        message: 'Image is sharpened',
      };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.sharpen': { publicId, options } };
      throw error;
    }
  }

  async format({ publicId, storage, options }: ProcessorParams): Promise<UploadResponse> {
    try {
      const image = this.getImage(storage);
      const buffer = Buffer.from(image.buffer, 'base64');

      const formattedBuffer = await sharp(buffer).toFormat(options.formatType).toBuffer();

      storage = extractStorage(storage, image, process.format, formattedBuffer, options);

      this.queueEvent.emit(event.BACKGROUND_JOB, JOB.cacheStorage.name, { storage });

      return {
        data: { publicId },
        image: storage.effectsApplied[storage.effectsIdx],
        success: true,
        message: `Image formatted to ${options.formatType as unknown as string}`,
      };
    } catch (error) {
      error.meta = { ...error.meta, 'imageProcessing.format': { publicId, options } };
      throw error;
    }
  }
}
