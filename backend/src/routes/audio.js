const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/audioController');

router.get('/chapter/:chapterId', mediaController.getChapterAudio.bind(mediaController));
router.get('/verse/:verseKey', mediaController.getVerseAudio.bind(mediaController));

module.exports = router;
