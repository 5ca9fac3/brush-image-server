import { ObjectId } from 'mongoose';

/* Defining the interface of the UpdateImage object. */
export interface UpdateImage {
  _id?: ObjectId;
  fileName?: string;
  mimeType?: string;
  accessKey?: string;
  location?: string;
  processType?: string;
}
