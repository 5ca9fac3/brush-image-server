import { Redis } from 'ioredis';

import { ConstructorOpts } from '../../interfaces/common/constructorOpts';

export class CacheService {
  cache: Redis;

  constructor(opts: ConstructorOpts) {
    this.cache = opts.cache;
  }

  async setData(storage: Storage): Promise<void> {
    try {
      await this.cache.set(`${storage._id}`, JSON.stringify(storage));

      return;
    } catch (error) {
      error.meta = { ...error.meta, 'cacheService.setData': { storage } };
      throw error;
    }
  }

  async getData(storageId: string): Promise<Record<string, string>> {
    try {
      const value = await this.cache.get(`${storageId}`);

      return JSON.parse(value);
    } catch (error) {
      error.meta = { ...error.meta, 'cacheService.getData': { storageId } };
      throw error;
    }
  }
}
