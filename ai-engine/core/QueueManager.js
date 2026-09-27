const EventEmitter = require('events');
const logger = require('../utilities/logger');

class QueueManager extends EventEmitter {
  constructor(options = {}) {
    super();
    this.concurrency = options.concurrency || 4;
    this.activeWorkers = 0;
    this.queue = []; // Array of { id, taskFn, priority, retries, maxRetries, addedAt }
    this.deadLetterQueue = [];
    this.isProcessing = false;
  }

  enqueue(taskFn, options = {}) {
    const job = {
      id: options.id || `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: options.name || 'UnnamedJob',
      taskFn,
      priority: options.priority || 10, // Higher number = higher priority
      retries: 0,
      maxRetries: options.maxRetries ?? 3,
      addedAt: Date.now()
    };

    // Priority insertion (descending priority)
    const index = this.queue.findIndex(item => item.priority < job.priority);
    if (index === -1) {
      this.queue.push(job);
    } else {
      this.queue.splice(index, 0, job);
    }

    logger.debug(`Job enqueued: ${job.name} (${job.id}), Queue length: ${this.queue.length}`);
    this.emit('job:enqueued', job);
    this.processNext();
    return job.id;
  }

  async processNext() {
    if (this.activeWorkers >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift();
    if (!job) return;

    this.activeWorkers += 1;
    logger.debug(`Starting job [${job.name}] (${job.id}). Active workers: ${this.activeWorkers}`);

    try {
      const result = await job.taskFn();
      this.emit('job:completed', { job, result });
      logger.debug(`Job completed successfully: [${job.name}] (${job.id})`);
    } catch (err) {
      logger.warn(`Job failed: [${job.name}] (${job.id}) - ${err.message}`);
      job.retries += 1;

      if (job.retries <= job.maxRetries) {
        logger.info(`Re-queueing job [${job.name}] (${job.id}) for retry ${job.retries}/${job.maxRetries}`);
        this.queue.push(job);
        this.emit('job:retrying', { job, error: err });
      } else {
        logger.error(`Job dead-lettered: [${job.name}] (${job.id}) after max retries.`);
        this.deadLetterQueue.push({ job, error: err.message, failedAt: new Date().toISOString() });
        this.emit('job:deadletter', { job, error: err });
      }
    } finally {
      this.activeWorkers -= 1;
      // Trigger next job in queue
      setImmediate(() => this.processNext());
    }
  }

  getStats() {
    return {
      pendingJobs: this.queue.length,
      activeWorkers: this.activeWorkers,
      concurrency: this.concurrency,
      deadLetterCount: this.deadLetterQueue.length
    };
  }
}

module.exports = { QueueManager, defaultQueue: new QueueManager() };
