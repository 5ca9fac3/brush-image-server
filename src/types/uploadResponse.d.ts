import { Image } from './image';
import { General } from './general';

export interface UploadResponse extends General {
  data?: { publicId: string };
  image?: Image;
}
