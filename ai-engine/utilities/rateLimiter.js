/**
 * Token Bucket Rate Limiter
 */
class RateLimiter {
  constructor(options = {}) {
    this.tokensPerInterval = options.tokensPerInterval || 30;
    this.intervalMs = options.intervalMs || 60000;
    this.availableTokens = this.tokensPerInterval;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    if (elapsed > this.intervalMs) {
      this.availableTokens = this.tokensPerInterval;
      this.lastRefill = now;
    } else {
      const addedTokens = Math.floor((elapsed / this.intervalMs) * this.tokensPerInterval);
      if (addedTokens > 0) {
        this.availableTokens = Math.min(this.tokensPerInterval, this.availableTokens + addedTokens);
        this.lastRefill = now;
      }
    }
  }

  async acquire(cost = 1) {
    while (true) {
      this.refill();
      if (this.availableTokens >= cost) {
        this.availableTokens -= cost;
        return true;
      }
      // Wait for tokens to accumulate
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

module.exports = { RateLimiter };
