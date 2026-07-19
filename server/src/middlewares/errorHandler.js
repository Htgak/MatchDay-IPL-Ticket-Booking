const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Never leak stack traces in responses as per Agent.md rules
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥', err); // Log for debugging
  }

  // Handle specific errors
  if (err.name === 'ZodError') {
    err.statusCode = 400;
    err.message = 'Validation Error: ' + err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
  }

  // Handle Razorpay errors which come as { error: { description } }
  if (err.error && err.error.description) {
    err.message = err.error.description;
    err.statusCode = err.statusCode || 400;
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Internal Server Error', // Fallback
  });
};

module.exports = errorHandler;
