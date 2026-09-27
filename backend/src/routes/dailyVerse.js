const express = require('express');
const router = express.Router();
const dailyVerseController = require('../controllers/dailyVerseController');

router.get('/today', dailyVerseController.getToday.bind(dailyVerseController));

module.exports = router;
