import { General } from '../common/general';

export interface UploadResponse extends General {
  data: { publicId: string };
}
