import { Storage } from './storage';
import { Options } from './options';

export interface ProcessorParams {
  storage: Storage;
  publicId: string;
  options: Options;
  imageProcess: string;
}
