/* Defining the interface of the Image object. */
export interface Image {
  _id?: string;
  fileName: string;
  mimeType: string;
  accessKey: string;
  location: string;
  processType?: string;
  buffer?: string;
}
