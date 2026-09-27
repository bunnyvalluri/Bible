const NodeCache = require('node-cache');
const config = require('../config/env');

const cache = new NodeCache({
  stdTTL: config.CACHE_TTL_SECONDS,
  checkperiod: 120
});

module.exports = {
  get: (key) => cache.get(key),
  set: (key, val, ttl) => cache.set(key, val, ttl),
  del: (key) => cache.del(key),
  flush: () => cache.flushAll(),
  getStats: () => cache.getStats()
};
