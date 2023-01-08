import { RGBA, Region } from 'sharp';
import { v4 as uuid } from 'uuid';

import { formatTypes, process } from '../constants';
import { Image } from '../interfaces/schema/image';
import { Storage } from '../interfaces/schema/storage';

interface Options {
  width?: number;
  height?: number;
  dimension?: Region;
  tintOptions?: RGBA;
  angle?: number;
  blurPoint?: number;
  sharpenPoint?: number;
  formatType?: string;
}

export const isValidFormatType = (format: string): Boolean => {
  return formatTypes.includes(format);
};

export const extractStorage = (
  storage: Storage,
  image: Image,
  processType: string,
  imageBuffer: Buffer,
  options: Options
): Storage | never => {
  const processedData = {
    ...image,
    processType,
    buffer: imageBuffer.toString('base64'),
  };

  let effectsKey = '';
  switch (processType) {
    case process.resize:
      effectsKey = `${process.resize}_${options.width}x${options.height}_${uuid()}`;
      break;
    case process.crop:
      effectsKey = `${process.crop}_${options.dimension.width}x${options.dimension.height}x${options.dimension.top}x${
        options.dimension.left
      }_${uuid()}`;
      break;
    case process.grayscale:
      effectsKey = `${process.grayscale}_${uuid()}`;
      break;
    case process.tint:
      effectsKey = `${process.tint}_rgb${options.tintOptions.r}${options.tintOptions.g}${
        options.tintOptions.b
      }_${uuid()}`;
      break;
    case process.rotate:
      effectsKey = `${process.rotate}_${options.angle}_${uuid()}`;
      break;
    case process.blur:
      effectsKey = `${process.blur}_${options.blurPoint}_${uuid()}`;
      break;
    case process.sharpen:
      effectsKey = `${process.sharpen}_${options.sharpenPoint}_${uuid()}`;
      break;
    case process.format:
      effectsKey = `${process.format}_${options.formatType}_${uuid()}`;
      break;
    default:
      throw new Error('Undefined process type');
  }
  storage.effects.push(effectsKey);
  storage.effectsApplied[effectsKey] = processedData;

  storage.currentState = processedData;
  storage.effectsIdx += 1;

  return storage;
};
