const express = require('express');
const router = express.Router();
const illustrationController = require('../controllers/illustrationController');

// GET /api/illustrations/:verseKey
router.get('/:verseKey', (req, res) => illustrationController.getByVerseKey(req, res));

// POST /api/illustrations/generate
router.post('/generate', (req, res) => illustrationController.generate(req, res));

// POST /api/illustrations/batch
router.post('/batch', (req, res) => illustrationController.batch(req, res));

// POST /api/illustrations/:id/regenerate
router.post('/:id/regenerate', (req, res) => illustrationController.regenerate(req, res));

// GET /api/illustrations/:id/status
router.get('/:id/status', (req, res) => illustrationController.getStatus(req, res));

// POST /api/illustrations/:id/qa
router.post('/:id/qa', (req, res) => illustrationController.submitQA(req, res));

module.exports = router;
