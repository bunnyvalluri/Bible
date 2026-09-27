const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

router.get('/', planController.getPlans.bind(planController));
router.get('/:id', planController.getPlanById.bind(planController));

module.exports = router;
