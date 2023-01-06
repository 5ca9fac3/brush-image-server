import { JOB_TYPE } from '../../constants';

export class ImageService {
  imageRepository: any;
  s3Service: any;
  cacheService: any;
  runBackgroundJobs: any;
  
  constructor({ imageRepository, s3Service, runBackgroundJobs, cacheService }) {
    this.imageRepository = imageRepository;
    this.s3Service = s3Service;
    this.cacheService = cacheService;
    this.runBackgroundJobs = runBackgroundJobs;
  }

  async upload(file) {
    try {
      const store = await this.s3Service.uploadImage(file);

      const image = await this.imageRepository.create({
        fileName: file.originalname,
        mimeType: file.mimetype,
        accessKey: store.Key,
        location: store.Location,
      });

      const imageData = {
        _id: image._id,
        mimeType: image.mimeType,
        fileName: image.fileName,
        accessKey: image.accessKey,
        location: image.location,
        buffer: file.buffer.toString('base64'),
      };

      this.runBackgroundJobs({
        name: JOB_TYPE.upload.name,
        meta: imageData,
        className: this.cacheService,
        jobToProcess: this.cacheService.setImage,
      });

      return { publicId: image._id };
    } catch (error) {
      // TODO: logger to implemeted
      // Rollbacks
      error.meta = { ...error.meta, 'imageService.upload': { file } };
      throw error;
    }
  }

  async download(publicId, name) {
    try {
      const image = await this.imageRepository.findById(publicId);

      this.runBackgroundJobs({
        name: JOB_TYPE.download.name,
        meta: image,
        className: this.s3Service,
        jobToProcess: this.s3Service.retrieveImage,
      });

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageService.download': { publicId } };
      throw error;
    }
  }

  async updateProcessedImage(imageData) {
    try {
      const updatedData = [
        {
          $set: {
            processType: imageData.processType,
          },
        },
      ];

      await this.imageRepository.update(imageData._id, updatedData);

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'imageService.updateProcessedImage': { imageData } };
      throw error;
    }
  }
}
