const { getQueueManager } = require('../queues/QueueManager');
const broadcaster = require('../realtime/broadcaster');

/**
 * Controller for Real-Time Background Jobs & Offline Sync
 */
class RealtimeJobController {
  constructor(prisma) {
    this.prisma = prisma;
    this.queueManager = getQueueManager(prisma);
  }

  // 1. Submit AI Explanation Job
  createExplanationJob = async (req, res) => {
    try {
      const { verseKey, language = 'en' } = req.body;
      if (!verseKey) {
        return res.status(400).json({ success: false, error: 'verseKey is required' });
      }

      const idempotencyKey = `ai_explain_${verseKey}_${language}`;
      const job = await this.queueManager.enqueueJob('ai-explanation', { verseKey, language }, {
        idempotencyKey
      });

      res.status(202).json({
        success: true,
        jobId: job.jobId,
        status: job.status,
        message: 'AI Explanation job queued in real-time processing engine'
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  // 2. Submit Illustration Job
  createIllustrationJob = async (req, res) => {
    try {
      const { verseKey, style = 'vachanam-editorial-handdrawn', language = 'en' } = req.body;
      if (!verseKey) {
        return res.status(400).json({ success: false, error: 'verseKey is required' });
      }

      const idempotencyKey = `illustration_${verseKey}_${style}`;
      const job = await this.queueManager.enqueueJob('illustration', { verseKey, style, language }, {
        idempotencyKey
      });

      res.status(202).json({
        success: true,
        jobId: job.jobId,
        status: job.status,
        message: 'Illustration generation job queued in real-time engine'
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  // 3. Submit Audio Job
  createAudioJob = async (req, res) => {
    try {
      const { verseKey, chapterId, language = 'en' } = req.body;

      const idempotencyKey = `audio_${verseKey || chapterId}_${language}`;
      const job = await this.queueManager.enqueueJob('audio', { verseKey, chapterId, language }, {
        idempotencyKey
      });

      res.status(202).json({
        success: true,
        jobId: job.jobId,
        status: job.status,
        message: 'Audio generation job queued in real-time engine'
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  // 4. Get Job Status by ID
  getJobStatus = async (req, res) => {
    try {
      const { jobId } = req.params;
      const job = await this.prisma.asyncJob.findUnique({
        where: { jobId }
      });

      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }

      res.json({
        success: true,
        job: {
          jobId: job.jobId,
          type: job.type,
          status: job.status,
          progress: job.progress,
          stage: job.stage,
          message: job.message,
          result: job.result ? JSON.parse(job.result) : null,
          error: job.error,
          createdAt: job.createdAt,
          startedAt: job.startedAt,
          completedAt: job.completedAt
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  // 5. Offline Sync Batch
  syncOfflineOperations = async (req, res) => {
    try {
      const { operations = [], clientId = 'anonymous' } = req.body;

      if (!Array.isArray(operations) || operations.length === 0) {
        return res.json({ success: true, syncedCount: 0, results: [] });
      }

      const job = await this.queueManager.enqueueJob('sync-operations', { operations, clientId });

      res.status(202).json({
        success: true,
        jobId: job.jobId,
        message: `Syncing ${operations.length} offline operations`
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  // 6. Admin Realtime Health & Metrics
  getRealtimeHealth = async (req, res) => {
    try {
      const activeConnections = broadcaster.getConnectionCount();
      const queuedJobsCount = await this.prisma.asyncJob.count({ where: { status: 'QUEUED' } });
      const runningJobsCount = await this.prisma.asyncJob.count({ where: { status: 'RUNNING' } });
      const completedJobsCount = await this.prisma.asyncJob.count({ where: { status: 'COMPLETED' } });
      const failedJobsCount = await this.prisma.asyncJob.count({ where: { status: 'FAILED' } });

      const recentJobs = await this.prisma.asyncJob.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      res.json({
        success: true,
        realtime: {
          status: 'HEALTHY',
          activeConnections,
          queueStatus: 'ACTIVE',
          outboxStatus: 'ACTIVE'
        },
        jobs: {
          queued: queuedJobsCount,
          running: runningJobsCount,
          completed: completedJobsCount,
          failed: failedJobsCount,
          recent: recentJobs.map(j => ({
            jobId: j.jobId,
            type: j.type,
            status: j.status,
            progress: j.progress,
            stage: j.stage,
            createdAt: j.createdAt,
            completedAt: j.completedAt
          }))
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
}

module.exports = { RealtimeJobController };
