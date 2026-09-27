const logger = require('../utilities/logger');

class AICacheManager {
  constructor(options = {}) {
    this.memoryCache = new Map();
    this.defaultTTL = options.defaultTTL || 86400 * 1000; // 24 hours in ms
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };
  }

  get(key) {
    const entry = this.memoryCache.get(key);
    if (!entry) {
      this.stats.misses += 1;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      this.stats.evictions += 1;
      this.stats.misses += 1;
      return null;
    }

    this.stats.hits += 1;
    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTTL) {
    this.memoryCache.set(key, {
      value,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttlMs
    });
    this.stats.sets += 1;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.memoryCache.delete(key);
  }

  flush() {
    const count = this.memoryCache.size;
    this.memoryCache.clear();
    logger.info(`Flushed ${count} items from AI Cache Manager`);
    return count;
  }

  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
    return {
      size: this.memoryCache.size,
      hitRate: `${hitRate.toFixed(1)}%`,
      ...this.stats
    };
  }
}

module.exports = {
  AICacheManager,
  defaultCacheManager: new AICacheManager()
};
