const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/', searchController.search.bind(searchController));
router.get('/suggestions', searchController.getSuggestions.bind(searchController));
router.get('/popular', searchController.getPopular.bind(searchController));

module.exports = router;
