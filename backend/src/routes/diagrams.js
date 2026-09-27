const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/', aiController.getDiagrams.bind(aiController));
router.get('/:id', aiController.getDiagramById.bind(aiController));

module.exports = router;
