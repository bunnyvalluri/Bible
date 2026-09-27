const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const prisma = require('../src/config/db');
const eventBus = require('../src/realtime/eventBus');
const roomManager = require('../src/realtime/roomManager');
const broadcaster = require('../src/realtime/broadcaster');
const { getOutboxService } = require('../src/outbox/OutboxService');
const { getQueueManager } = require('../src/queues/QueueManager');
const { registerAllJobWorkers } = require('../src/workers/JobWorkers');
const { REALTIME_EVENTS, JOB_STATES } = require('@vachanam/shared');

describe('Vachanam Real-Time Systems Test Suite', () => {
  let outboxService;
  let queueManager;

  before(async () => {
    await prisma.$connect();
    outboxService = getOutboxService(prisma);
    queueManager = getQueueManager(prisma);
    registerAllJobWorkers(queueManager, prisma);
  });

  it('1. RoomManager validates authorized room patterns', () => {
    assert.strictEqual(roomManager.isValidRoom('global'), true);
    assert.strictEqual(roomManager.isValidRoom('language:te'), true);
    assert.strictEqual(roomManager.isValidRoom('language:en'), true);
    assert.strictEqual(roomManager.isValidRoom('chapter:GEN.1'), true);
    assert.strictEqual(roomManager.isValidRoom('verse:JHN.3.16'), true);
    assert.strictEqual(roomManager.isValidRoom('job:job_12345'), true);
    assert.strictEqual(roomManager.isValidRoom('admin'), true);

    // Invalid rooms
    assert.strictEqual(roomManager.isValidRoom('arbitrary_malicious_room'), false);
    assert.strictEqual(roomManager.isValidRoom(''), false);
    assert.strictEqual(roomManager.isValidRoom(null), false);
  });

  it('2. EventBus publishes and formats real-time events with standard schema', (t, done) => {
    const testPayload = { verseKey: 'JHN.3.16', note: 'For God so loved' };

    const unsubscribe = (event) => {
      assert.strictEqual(event.eventType, REALTIME_EVENTS.AI_EXPLANATION_STARTED);
      assert.strictEqual(event.entityId, 'JHN.3.16');
      assert.ok(event.eventId.startsWith('evt_'));
      assert.ok(event.timestamp);
      eventBus.off(REALTIME_EVENTS.AI_EXPLANATION_STARTED, unsubscribe);
      done();
    };

    eventBus.on(REALTIME_EVENTS.AI_EXPLANATION_STARTED, unsubscribe);

    eventBus.publish(REALTIME_EVENTS.AI_EXPLANATION_STARTED, {
      entityId: 'JHN.3.16',
      rooms: ['verse:JHN.3.16'],
      payload: testPayload
    });
  });

  it('3. Transactional Outbox records and publishes pending events', async () => {
    const testVerseKey = 'PSA.23.1';
    
    // Create an outbox event
    const record = await outboxService.createOutboxEvent(prisma, {
      eventType: REALTIME_EVENTS.BIBLE_VERSE_UPDATED,
      aggregateType: 'verse',
      aggregateId: testVerseKey,
      payload: { verseKey: testVerseKey, updated: true },
      rooms: ['global', `verse:${testVerseKey}`]
    });

    assert.ok(record.id);
    assert.strictEqual(record.status, 'PENDING');

    // Process pending outbox events
    await outboxService.processPendingEvents();

    // Verify record is marked as PUBLISHED
    const updated = await prisma.outboxEvent.findUnique({
      where: { id: record.id }
    });

    assert.strictEqual(updated.status, 'PUBLISHED');
    assert.ok(updated.processedAt);
  });

  it('4. QueueManager processes async jobs with multi-stage progress reporting', async () => {
    const job = await queueManager.enqueueJob('ai-explanation', {
      verseKey: 'GEN.1.1',
      language: 'en'
    });

    assert.ok(job.jobId);
    assert.strictEqual(job.type, 'ai-explanation');

    // Wait for worker execution
    await queueManager.processNextJob();

    // Verify job completed in DB
    const completedJob = await prisma.asyncJob.findUnique({
      where: { jobId: job.jobId }
    });

    assert.strictEqual(completedJob.status, JOB_STATES.COMPLETED);
    assert.strictEqual(completedJob.progress, 100);
    assert.ok(completedJob.result);
  });

  it('5. Offline Sync Worker processes multi-operation batches cleanly', async () => {
    const syncJob = await queueManager.enqueueJob('sync-operations', {
      operations: [
        {
          operationId: 'sync_test_bm_1',
          entityType: 'bookmark',
          entityId: 'bm_unit_test',
          operation: 'CREATE',
          payload: {
            id: 'bm_unit_test',
            verseKey: 'JHN.3.16',
            bookName: 'John',
            chapterNumber: 3,
            verseNumber: 16,
            textPreview: 'For God so loved the world'
          }
        }
      ],
      clientId: 'test-runner'
    });

    await queueManager.processNextJob();

    const completed = await prisma.asyncJob.findUnique({
      where: { jobId: syncJob.jobId }
    });

    assert.strictEqual(completed.status, JOB_STATES.COMPLETED);
    const parsedResult = JSON.parse(completed.result);
    assert.strictEqual(parsedResult.syncedCount, 1);
  });
});
