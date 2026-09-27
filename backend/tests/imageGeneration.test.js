const test = require('node:test');
const assert = require('node:assert');
const prisma = require('../src/config/db');
const { getQueueManager } = require('../src/queues/QueueManager');
const { registerAllJobWorkers } = require('../src/workers/JobWorkers');
const imageClient = require('../src/services/imageGenerationClient');
const illustrationController = require('../src/controllers/illustrationController');

// Initialize Queue & Workers for Test
const queueManager = getQueueManager(prisma);
registerAllJobWorkers(queueManager, prisma);

test('Vachanam Automated Illustration Generation Platform Test Suite', async (t) => {
  await t.test('1. ImageGenerationClient health check returns structured status', async () => {
    const health = await imageClient.getHealth();
    assert.ok(health);
    assert.ok(health.status === 'HEALTHY' || health.status === 'OFFLINE');
    assert.strictEqual(health.fallbackAvailable, health.status === 'OFFLINE' ? true : undefined);
  });

  await t.test('2. Single Verse Illustration Generation executes with Idempotency', async () => {
    const res1 = await imageClient.generateVerseIllustration({
      verseKey: 'GEN.1.1',
      bookCode: 'GEN',
      bookName: 'Genesis',
      chapter: 1,
      verseNumber: 1,
      verseText: 'In the beginning God created the heaven and the earth.',
      language: 'en',
      style: 'vachanam-editorial-handdrawn',
      forceRegenerate: true
    });

    assert.ok(res1.illustration);
    assert.strictEqual(res1.illustration.verseKey, 'GEN.1.1');
    assert.ok(res1.illustration.imageUrl);
    assert.strictEqual(res1.illustration.status, 'COMPLETED');
    assert.strictEqual(res1.illustration.aspectRatio, '16:9');

    // Test Idempotency: Second call should retrieve from cache
    const res2 = await imageClient.generateVerseIllustration({
      verseKey: 'GEN.1.1',
      bookCode: 'GEN',
      bookName: 'Genesis',
      chapter: 1,
      verseNumber: 1,
      verseText: 'In the beginning God created the heaven and the earth.',
      language: 'en',
      forceRegenerate: false
    });

    assert.strictEqual(res2.fromCache, true);
    assert.strictEqual(res2.illustration.id, res1.illustration.id);
  });

  await t.test('3. Chapter Batch Illustration Queuing dispatches batch job', async () => {
    const req = {
      params: { bookCode: 'GEN', chapterNumber: '1' },
      body: { language: 'en', qualityMode: 'STANDARD' }
    };
    let responseData = null;
    const res = {
      status: (code) => ({
        json: (data) => {
          responseData = { code, ...data };
          return responseData;
        }
      })
    };

    await illustrationController.generateChapterImages(req, res);
    assert.ok(responseData);
    assert.strictEqual(responseData.code, 202);
    assert.strictEqual(responseData.success, true);
    assert.ok(responseData.batchJobId);
    assert.strictEqual(responseData.bookCode, 'GEN');
  });

  await t.test('4. Resumable Full Bible Illustration Pipeline computes remaining verses', async () => {
    const req = {
      body: { language: 'en', batchSize: 5 }
    };
    let responseData = null;
    const res = {
      status: (code) => ({
        json: (data) => {
          responseData = { code, ...data };
          return responseData;
        }
      })
    };

    await illustrationController.generateBiblePipeline(req, res);
    assert.ok(responseData);
    assert.strictEqual(responseData.code, 202);
    assert.strictEqual(responseData.success, true);
    assert.ok(responseData.batchJobId);
    assert.ok(typeof responseData.currentBatchCount === 'number');
  });

  await t.test('5. Admin Illustration Review actions (Approve / Reject)', async () => {
    const record = await prisma.illustration.findFirst({
      where: { verseKey: 'GEN.1.1' }
    });
    assert.ok(record);

    // Test Reject
    const reqReject = { params: { id: record.id.toString() }, body: { reason: 'Test QA reject' } };
    let rejectData = null;
    const resReject = {
      json: (data) => { rejectData = data; return data; },
      status: () => ({ json: (d) => d })
    };
    await illustrationController.adminReject(reqReject, resReject);
    assert.strictEqual(rejectData.data.status, 'REJECTED');

    // Test Approve
    const reqApprove = { params: { id: record.id.toString() } };
    let approveData = null;
    const resApprove = {
      json: (data) => { approveData = data; return data; },
      status: () => ({ json: (d) => d })
    };
    await illustrationController.adminApprove(reqApprove, resApprove);
    assert.strictEqual(approveData.data.status, 'COMPLETED');
    assert.strictEqual(approveData.data.qaStatus, 'PASSED');
  });
});
