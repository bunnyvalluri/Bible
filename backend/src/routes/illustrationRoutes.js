const express = require('express');
const router = express.Router();
const illustrationController = require('../controllers/illustrationController');

// Health & Telemetry
router.get('/health', (req, res) => illustrationController.getHealth(req, res));

// Admin List & Management
router.get('/admin/list', (req, res) => illustrationController.adminList(req, res));
router.post('/admin/:id/approve', (req, res) => illustrationController.adminApprove(req, res));
router.post('/admin/:id/reject', (req, res) => illustrationController.adminReject(req, res));
router.delete('/admin/:id', (req, res) => illustrationController.adminDelete(req, res));

// Batch Workflows
router.post('/chapter/:bookCode/:chapterNumber', (req, res) => illustrationController.generateChapterImages(req, res));
router.post('/book/:bookCode', (req, res) => illustrationController.generateBookImages(req, res));
router.post('/bible/resumable', (req, res) => illustrationController.generateBiblePipeline(req, res));
router.post('/batch', (req, res) => illustrationController.batch(req, res));

// Single Verse Operations
router.get('/:verseKey', (req, res) => illustrationController.getByVerseKey(req, res));
router.post('/generate', (req, res) => illustrationController.generate(req, res));

module.exports = router;
