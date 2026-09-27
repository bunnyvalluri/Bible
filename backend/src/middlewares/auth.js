const config = require('../config/env');
const { errorResponse } = require('../utils/response');

/**
 * Secret Key Header/Query Authentication for Admin Endpoints
 * (No user login needed; endpoints protected via secure server key)
 */
function requireAdminKey(req, res, next) {
  const providedKey = req.headers['x-admin-key'] || req.query.adminKey;

  if (!providedKey || providedKey !== config.ADMIN_API_KEY) {
    return errorResponse(
      res,
      'Unauthorized: Valid admin secret key required for maintenance actions.',
      401
    );
  }

  next();
}

module.exports = { requireAdminKey };
