const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdminKey } = require('../middlewares/auth');

// Public health summary
router.get('/health', adminController.getSystemHealth.bind(adminController));

// Protected admin & batch operations
router.post('/batch/ai', requireAdminKey, adminController.triggerAIBatch.bind(adminController));
router.post('/batch/images', requireAdminKey, adminController.triggerImageBatch.bind(adminController));
router.post('/batch/audio', requireAdminKey, adminController.triggerAudioBatch.bind(adminController));
router.post('/cache/flush', requireAdminKey, adminController.flushCache.bind(adminController));
router.post('/import', requireAdminKey, adminController.importCustomBibleData.bind(adminController));

module.exports = router;
