const { errorResponse } = require('../utils/response');

function errorHandler(err, req, res, next) {
  console.error('Unhandled API Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';
  const errors = err.errors || (process.env.NODE_ENV === 'development' ? err.stack : undefined);

  return errorResponse(res, message, statusCode, errors);
}

module.exports = errorHandler;
