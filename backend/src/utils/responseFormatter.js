/**
 * Formats API responses consistently
 * @param {Object} options - Response options
 * @param {string} [options.status='success'] - Response status ('success' or 'error')
 * @param {string} [options.message] - Optional message
 * @param {any} [options.data] - Response data
 * @param {Array} [options.errors] - Array of error messages
 * @returns {Object} Formatted response object
 */
const responseFormatter = ({ status = 'success', message, data, errors = [] }) => {
  // Base response object
  const response = {
    status,
    timestamp: new Date().toISOString()
  };

  // Add message if provided
  if (message) {
    response.message = message;
  }

  // Add data if provided
  if (data !== undefined) {
    response.data = data;
  }

  // Add errors for error responses
  if (status === 'error' && errors.length > 0) {
    response.errors = errors;
  }

  // Add debug info in development
  if (process.env.NODE_ENV === 'development') {
    response.debug = {
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV
    };
  }

  return response;
};

/**
 * Formats paginated responses
 * @param {Object} options - Pagination options
 * @param {Array} options.data - Array of items
 * @param {number} options.page - Current page number
 * @param {number} options.limit - Items per page
 * @param {number} options.total - Total number of items
 * @returns {Object} Formatted paginated response
 */
const paginatedResponseFormatter = ({ data, page, limit, total }) => {
  const totalPages = Math.ceil(total / limit);
  
  return responseFormatter({
    status: 'success',
    data: {
      items: data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
};

/**
 * Formats error responses
 * @param {string} message - Error message
 * @param {Array} [errors] - Array of detailed error messages
 * @returns {Object} Formatted error response
 */
const errorResponseFormatter = (message, errors = []) => {
  return responseFormatter({
    status: 'error',
    message,
    errors: Array.isArray(errors) ? errors : [errors]
  });
};

module.exports = {
  responseFormatter,
  paginatedResponseFormatter,
  errorResponseFormatter
};
