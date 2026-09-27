const test = require('node:test');
const assert = require('node:assert');

const {
  LoopRunner,
  ExecutionContext,
  stateStore,
  defaultExplanationVerifier,
  defaultVerseExplanationLoop,
  defaultDailyVerseLoop,
  defaultCacheManager,
  defaultAnalytics,
  WorkflowRegistry
} = require('../index');

test('LoopRunner executes successfully with verification', async () => {
  const runner = new LoopRunner('TestRunner', { maxRetries: 2 });
  const result = await runner.run(
    { testKey: 'val' },
    {
      validate: async (inputs) => inputs.testKey === 'val',
      execute: async () => ({ generated: true, count: 3 }),
      verify: async (output) => ({ valid: output.generated === true })
    }
  );

  assert.strictEqual(result.state, 'COMPLETED');
  assert.strictEqual(result.outputs.generated, true);
  assert.strictEqual(result.metrics.verificationsPassed, 1);
});

test('ExplanationVerifier validates complete 6-dimensional breakdown', async () => {
  const validData = {
    simpleExplanation: 'This is a clear explanation of divine scripture.',
    keyPoints: ['First core spiritual point', 'Second key doctrinal truth'],
    historicalContext: 'Historical background of ancient Israel and apostolic ministry.',
    spiritualMeaning: 'Spiritual truths regarding grace and faith.',
    lifeApplication: 'Practical steps to walk in humility and love.',
    youthExplanation: 'Relatable guidance for students and youth.'
  };

  const res = await defaultExplanationVerifier.verify(validData);
  assert.strictEqual(res.valid, true);

  const invalidData = { simpleExplanation: 'Too short' };
  const failRes = await defaultExplanationVerifier.verify(invalidData);
  assert.strictEqual(failRes.valid, false);
});

test('VerseExplanationLoop generates verified explanation', async () => {
  const result = await defaultVerseExplanationLoop.execute({
    verseKey: 'JHN.3.16',
    reference: 'John 3:16',
    text: 'For God so loved the world...',
    language: 'en'
  });

  assert.ok(result.data);
  assert.ok(result.data.simpleExplanation);
  assert.ok(result.data.keyPoints);
  assert.strictEqual(typeof result.data.lifeApplication, 'string');
});

test('DailyVersePipelineWorkflow runs end-to-end', async () => {
  const workflow = WorkflowRegistry['daily-verse-pipeline'];
  const res = await workflow.run({ dateKey: '2026-09-27' });

  assert.strictEqual(res.status, 'SUCCESS');
  assert.ok(res.dailyVerse.verseTextEn);
});

test('IllustrationEngine generates verified 16:9 visual metaphor illustration', async () => {
  const { defaultIllustrationEngine } = require('../index');
  const result = await defaultIllustrationEngine.generateIllustration({
    verseKey: 'JHN.3.16',
    reference: 'John 3:16',
    text: 'For God so loved the world, that he gave his only begotten Son...',
    language: 'en',
    illustrationType: 'verse'
  });

  assert.ok(result.imageUrl);
  assert.strictEqual(result.aspectRatio, '16:9');
  assert.ok(result.visualMetaphor);
  assert.strictEqual(result.qa.approved, true);
  assert.strictEqual(result.qa.safetyScore, 1.0);
});

