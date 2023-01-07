import { ObjectId } from 'mongoose';

interface BufferData extends Buffer {
  data: ArrayBuffer
}

/* Defining the interface of the Image object. */
export interface Image {
  _id?: ObjectId;
  fileName: string;
  mimeType: string;
  accessKey: string;
  location: string;
  processType?: string;
  buffer?: BufferData;
}
