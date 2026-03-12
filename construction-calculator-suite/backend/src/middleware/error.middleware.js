/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and returns a consistent JSON response
 */

function errorHandler(err, _req, res, _next) {
  console.error('Server Error:', err.message);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
