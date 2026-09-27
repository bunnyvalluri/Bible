const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Vachanam API Test Suite', async (t) => {
  await t.test('GET / returns system information', async () => {
    const res = await request(app).get('/');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ONLINE');
    assert.strictEqual(res.body.app.includes('Vachanam'), true);
  });

  await t.test('GET /api/health returns healthy status', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'HEALTHY');
  });

  await t.test('GET /api/books returns list of canonical books', async () => {
    const res = await request(app).get('/api/books');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  await t.test('GET /api/books?testament=NT filters New Testament books', async () => {
    const res = await request(app).get('/api/books?testament=NT');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    if (res.body.data.length > 0) {
      assert.strictEqual(res.body.data[0].testament, 'NT');
    }
  });

  await t.test('GET /api/search executes multilingual full text search', async () => {
    const res = await request(app).get('/api/search?q=God');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.results));
  });

  await t.test('GET /api/search/popular returns popular suggested searches', async () => {
    const res = await request(app).get('/api/search/popular');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.length > 0);
  });

  await t.test('GET /api/daily-verse/today returns daily verse', async () => {
    const res = await request(app).get('/api/daily-verse/today');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.verseKey);
  });

  await t.test('GET /api/diagrams returns visual diagrams', async () => {
    const res = await request(app).get('/api/diagrams');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.length > 0);
  });

  await t.test('GET /api/plans returns reading plans', async () => {
    const res = await request(app).get('/api/plans');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.length > 0);
  });

  await t.test('POST /api/admin/cache/flush rejects request without valid admin key', async () => {
    const res = await request(app).post('/api/admin/cache/flush');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await t.test('POST /api/admin/cache/flush succeeds with valid admin key', async () => {
    const res = await request(app)
      .post('/api/admin/cache/flush')
      .set('x-admin-key', 'vachanam_admin_secret_key_2026');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });
});
