const express = require('express');
const router = express.Router();
const bibleController = require('../controllers/bibleController');

router.get('/:bookCode/:chapterNumber', bibleController.getChapter.bind(bibleController));

module.exports = router;
