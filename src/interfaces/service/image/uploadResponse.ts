import { ObjectId } from 'mongoose';

import { General } from '../common/general';

export interface UploadResponse extends General {
  data: { publicId: ObjectId };
}
