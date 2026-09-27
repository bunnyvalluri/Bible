const express = require('express');
const router = express.Router();
const bibleController = require('../controllers/bibleController');
const chapterStudyController = require('../controllers/chapterStudyController');

router.get('/:bookCode/:chapterNumber', bibleController.getChapter.bind(bibleController));
router.post('/:bookCode/:chapterNumber/generate-study-content', chapterStudyController.generateChapterStudyContent);

module.exports = router;

