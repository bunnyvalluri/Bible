const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/audioController');

router.get('/verse/:verseKey', mediaController.getVerseArtwork.bind(mediaController));

module.exports = router;
