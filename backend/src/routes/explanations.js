const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/:verseKey', aiController.getVerseExplanation.bind(aiController));

module.exports = router;
