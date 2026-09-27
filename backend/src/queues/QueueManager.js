const { REALTIME_EVENTS, JOB_STATES } = require('@vachanam/shared');
const eventBus = require('../realtime/eventBus');

/**
 * Enterprise Queue & Job Orchestration System
 * Manages background tasks with persistent state in Prisma, multi-stage progress reporting,
 * idempotency, retry mechanisms, and real-time Socket.IO event broadcasting.
 */
class RealtimeQueueManager {
  constructor(prisma) {
    this.prisma = prisma;
    this.handlers = new Map();
    this.isProcessing = false;
    this.queueInterval = null;
  }

  /**
   * Register a background worker handler for a specific job type
   */
  registerWorker(jobType, handlerFn) {
    this.handlers.set(jobType, handlerFn);
  }

  /**
   * Enqueue a new background job with idempotency
   */
  async enqueueJob(type, payload, options = {}) {
    const idempotencyKey = options.idempotencyKey || `${type}_${JSON.stringify(payload)}`;
    const jobId = options.jobId || `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Check if duplicate job is already running or completed recently
    if (options.idempotencyKey) {
      const existing = await this.prisma.asyncJob.findFirst({
        where: {
          jobId: options.idempotencyKey,
          status: { in: [JOB_STATES.PENDING, JOB_STATES.QUEUED, JOB_STATES.RUNNING, JOB_STATES.COMPLETED] }
        }
      });
      if (existing) {
        return existing;
      }
    }

    const jobRecord = await this.prisma.asyncJob.create({
      data: {
        jobId,
        type,
        status: JOB_STATES.QUEUED,
        progress: 0,
        stage: 'Queued in background queue',
        message: 'Job submitted and awaiting worker pickup',
        metadata: JSON.stringify(payload),
        retryCount: 0
      }
    });

    // Broadcast QUEUED event
    eventBus.publish(`${type}.started`, {
      entityId: jobId,
      rooms: ['global', `job:${jobId}`],
      payload: {
        jobId,
        type,
        status: JOB_STATES.QUEUED,
        progress: 0,
        stage: 'Queued'
      }
    });

    // Trigger immediate processor
    setImmediate(() => this.processNextJob());

    return jobRecord;
  }

  /**
   * Update live job progress and broadcast to Socket.IO room
   */
  async updateJobProgress(jobId, { progress, stage, message, status = JOB_STATES.RUNNING }) {
    await this.prisma.asyncJob.update({
      where: { jobId },
      data: {
        progress,
        stage,
        message,
        status
      }
    });

    const job = await this.prisma.asyncJob.findUnique({ where: { jobId } });
    if (!job) return;

    // Emit live progress event
    eventBus.publish(`${job.type}.progress`, {
      entityId: jobId,
      rooms: ['global', `job:${jobId}`],
      payload: {
        jobId,
        type: job.type,
        status,
        progress,
        stage,
        message
      }
    });
  }

  /**
   * Mark job as completed and broadcast result
   */
  async completeJob(jobId, result) {
    const job = await this.prisma.asyncJob.update({
      where: { jobId },
      data: {
        status: JOB_STATES.COMPLETED,
        progress: 100,
        stage: 'Completed successfully',
        message: 'Job processed and verified',
        result: JSON.stringify(result),
        completedAt: new Date()
      }
    });

    eventBus.publish(`${job.type}.completed`, {
      entityId: jobId,
      rooms: ['global', `job:${jobId}`],
      payload: {
        jobId,
        type: job.type,
        status: JOB_STATES.COMPLETED,
        progress: 100,
        result
      }
    });

    return job;
  }

  /**
   * Mark job as failed and broadcast failure
   */
  async failJob(jobId, error) {
    const job = await this.prisma.asyncJob.update({
      where: { jobId },
      data: {
        status: JOB_STATES.FAILED,
        stage: 'Processing failed',
        message: error.message || 'Unknown processing error',
        error: error.stack || error.message,
        completedAt: new Date()
      }
    });

    eventBus.publish(`${job.type}.failed`, {
      entityId: jobId,
      rooms: ['global', `job:${jobId}`],
      payload: {
        jobId,
        type: job.type,
        status: JOB_STATES.FAILED,
        error: error.message
      }
    });

    return job;
  }

  /**
   * Process next queued job
   */
  async processNextJob() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const nextJob = await this.prisma.asyncJob.findFirst({
        where: { status: JOB_STATES.QUEUED },
        orderBy: { createdAt: 'asc' }
      });

      if (!nextJob) {
        this.isProcessing = false;
        return;
      }

      // Mark as running
      await this.prisma.asyncJob.update({
        where: { id: nextJob.id },
        data: {
          status: JOB_STATES.RUNNING,
          startedAt: new Date(),
          stage: 'Worker processing started'
        }
      });

      const handler = this.handlers.get(nextJob.type);
      if (!handler) {
        throw new Error(`No worker handler registered for job type: ${nextJob.type}`);
      }

      const payload = JSON.parse(nextJob.metadata || '{}');
      
      // Execute worker handler with progress reporter
      const progressReporter = {
        report: (progress, stage, message) => this.updateJobProgress(nextJob.jobId, { progress, stage, message })
      };

      const result = await handler(payload, progressReporter, nextJob);
      await this.completeJob(nextJob.jobId, result);
    } catch (err) {
      console.error(`[QueueManager] Job execution error:`, err);
    } finally {
      this.isProcessing = false;
      // Check if more jobs are queued
      const pendingCount = await this.prisma.asyncJob.count({ where: { status: JOB_STATES.QUEUED } });
      if (pendingCount > 0) {
        setImmediate(() => this.processNextJob());
      }
    }
  }

  /**
   * Start polling loop for queue processing
   */
  start(intervalMs = 1500) {
    if (this.queueInterval) return;
    this.queueInterval = setInterval(() => this.processNextJob(), intervalMs);
  }

  stop() {
    if (this.queueInterval) {
      clearInterval(this.queueInterval);
      this.queueInterval = null;
    }
  }
}

let queueManagerInstance = null;

function getQueueManager(prisma) {
  if (!queueManagerInstance && prisma) {
    queueManagerInstance = new RealtimeQueueManager(prisma);
  }
  return queueManagerInstance;
}

module.exports = {
  RealtimeQueueManager,
  getQueueManager
};
