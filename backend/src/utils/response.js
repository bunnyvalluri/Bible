/**
 * Standard API Response Utilities
 */

function successResponse(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

function paginatedResponse(res, data, pagination, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString()
  });
}

function errorResponse(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  successResponse,
  paginatedResponse,
  errorResponse
};
