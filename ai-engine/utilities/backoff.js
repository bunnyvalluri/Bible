/**
 * Exponential backoff with jitter
 * @param {Function} fn - Async function to execute
 * @param {Object} options - Retry configuration
 * @returns {Promise<any>}
 */
async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    factor = 2,
    maxDelayMs = 10000,
    jitter = true,
    onRetry = null
  } = options;

  let lastError;
  let delay = initialDelayMs;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;

      const randomJitter = jitter ? Math.random() * 0.3 * delay : 0;
      const sleepTime = Math.min(delay + randomJitter, maxDelayMs);

      if (onRetry) {
        onRetry({ attempt, error, nextDelayMs: sleepTime });
      }

      await new Promise((resolve) => setTimeout(resolve, sleepTime));
      delay *= factor;
    }
  }

  throw lastError;
}

module.exports = { retryWithBackoff };
