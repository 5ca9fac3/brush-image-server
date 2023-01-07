import { Redis } from 'ioredis';

import { Image } from '../../interfaces/schema/image';

interface CacheServiceOpts {
  cache: Redis;
}

export class CacheService {
  cache: Redis;

  constructor(opts: CacheServiceOpts) {
    this.cache = opts.cache;
  }

  async setImage(image: Image): Promise<void> {
    try {
      await this.cache.hset(`${image._id}`, image);

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'cacheService.setImage': { image } };
      throw error;
    }
  }

  async getImage(imageId: string): Promise<Record<string, string>> {
    try {
      const value = await this.cache.hgetall(`${imageId}`);

      return value;
    } catch (error) {
      error.meta = { ...error.meta, 'cacheService.getImage': { imageId } };
      throw error;
    }
  }
}
