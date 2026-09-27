const prisma = require('../config/db');
const { READING_PLANS } = require('../../../shared');
const { successResponse, errorResponse } = require('../utils/response');

class PlanController {
  async getPlans(req, res, next) {
    try {
      const plans = await prisma.readingPlan.findMany();
      if (plans && plans.length > 0) {
        return successResponse(res, plans, 'Reading plans retrieved');
      }
      return successResponse(res, READING_PLANS, 'Reading plans retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getPlanById(req, res, next) {
    try {
      const { id } = req.params;
      const plan = READING_PLANS.find(p => p.id === id);
      if (!plan) {
        return errorResponse(res, `Reading plan not found: ${id}`, 404);
      }
      return successResponse(res, plan, 'Reading plan details retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PlanController();
