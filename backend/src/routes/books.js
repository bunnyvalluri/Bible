const express = require('express');
const router = express.Router();
const bibleController = require('../controllers/bibleController');

router.get('/', bibleController.getBooks.bind(bibleController));
router.get('/:identifier', bibleController.getBook.bind(bibleController));

module.exports = router;
