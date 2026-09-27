const express = require('express');
const router = express.Router();
const bibleController = require('../controllers/bibleController');

router.get('/:verseKey', bibleController.getVerse.bind(bibleController));

module.exports = router;
