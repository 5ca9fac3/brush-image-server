import { container } from '../utils/dependencyInjection';

import { CacheService } from './cache';

export const cacheService: CacheService = container.resolve('cacheService');
