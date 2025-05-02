const { responseFormatter } = require('./responseFormatter');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Default error
  let error = {
    status: 'error',
    message: err.message || 'Internal Server Error',
    errors: []
  };

  // Not Found errors - return empty data instead of error
  if (err.message.includes('not found') || 
      err.message.includes('No data found') ||
      (err.name === 'CastError' && err.kind === 'ObjectId')) {
    if (req.method === 'GET') {
      return res.status(200).json(responseFormatter({
        status: 'success',
        data: Array.isArray(req.query) ? [] : null
      }));
    }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json(responseFormatter(error));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.errors = [`${Object.keys(err.keyValue)} already exists`];
    return res.status(400).json(responseFormatter(error));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json(responseFormatter(error));
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    return res.status(401).json(responseFormatter(error));
  }

  // Authentication errors
  if (err.message === 'Invalid credentials') {
    return res.status(401).json(responseFormatter({
      status: 'error',
      message: 'Invalid email or password'
    }));
  }

  // Profile not found errors
  if (err.message.includes('profile not found')) {
    return res.status(404).json(responseFormatter({
      status: 'error',
      message: err.message
    }));
  }

  // Handle other specific error types
  switch (err.name) {
    case 'CastError':
      if (req.method === 'GET') {
        return res.status(200).json(responseFormatter({
          status: 'success',
          data: Array.isArray(req.query) ? [] : null
        }));
      }
      error.message = 'Resource not found';
      error.errors = ['Invalid ID format'];
      return res.status(404).json(responseFormatter(error));

    case 'SyntaxError':
      error.message = 'Invalid request syntax';
      return res.status(400).json(responseFormatter(error));

    case 'TypeError':
      error.message = 'Invalid request data';
      return res.status(400).json(responseFormatter(error));

    default:
      // If the error hasn't been handled above, return 500 Internal Server Error
      return res.status(500).json(responseFormatter({
        status: 'error',
        message: 'Internal Server Error',
        errors: process.env.NODE_ENV === 'development' ? [err.message] : []
      }));
  }
};

module.exports = errorHandler;
