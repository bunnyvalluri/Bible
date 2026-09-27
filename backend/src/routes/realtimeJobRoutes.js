const express = require('express');
const { RealtimeJobController } = require('../controllers/realtimeJobController');

function createRealtimeJobRoutes(prisma) {
  const router = express.Router();
  const controller = new RealtimeJobController(prisma);

  router.post('/explanation', controller.createExplanationJob);
  router.post('/illustration', controller.createIllustrationJob);
  router.post('/audio', controller.createAudioJob);
  router.get('/health', controller.getRealtimeHealth);
  router.get('/:jobId', controller.getJobStatus);
  router.post('/sync', controller.syncOfflineOperations);

  return router;
}

module.exports = { createRealtimeJobRoutes };
