/**
 * Formats API responses consistently
 * @param {Object} options - Response options
 * @param {string} options.status - Response status ('success' or 'error')
 * @param {*} [options.data] - Response data (for success responses)
 * @param {string} [options.message] - Response message (for error responses)
 * @param {*} [options.error] - Error details (for error responses)
 * @returns {Object} Formatted response object
 */
const responseFormatter = ({ status, data, message, error }) => {
  console.log('Response Formatter - Input:', { status, data, message, error });
  
  // Validate status
  if (!['success', 'error'].includes(status)) {
    console.error('Response Formatter - Invalid status:', status);
    throw new Error('Invalid response status');
  }

  // Base response object
  const response = {
    status,
    timestamp: new Date().toISOString()
  };

  // Add data for success responses
  if (status === 'success' && data !== undefined) {
    response.data = data;
  }

  // Add message and error details for error responses
  if (status === 'error') {
    response.message = message || 'An error occurred';
    if (error && process.env.NODE_ENV === 'development') {
      response.error = error;
    }
  }

  console.log('Response Formatter - Output:', response);
  return response;
};

/**
 * Formats success responses
 * @param {*} data - Response data
 * @returns {Object} Formatted success response
 */
responseFormatter.success = (data) => {
  return responseFormatter({
    status: 'success',
    data
  });
};

/**
 * Formats error responses
 * @param {string} message - Error message
 * @param {*} [error] - Error details (included in development)
 * @returns {Object} Formatted error response
 */
responseFormatter.error = (message, error) => {
  return responseFormatter({
    status: 'error',
    message,
    error
  });
};

module.exports = {
  responseFormatter
};
