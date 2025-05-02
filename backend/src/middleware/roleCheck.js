const { responseFormatter } = require('../utils/responseFormatter');

const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json(responseFormatter({
          status: 'error',
          message: 'User not authenticated'
        }));
      }

      // Check if user's role is in the allowed roles array
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json(responseFormatter({
          status: 'error',
          message: 'Access denied. Insufficient permissions.'
        }));
      }

      // Check for role-specific profile
      switch (req.user.role) {
        case 'staff':
          if (!req.staffProfile) {
            return res.status(403).json(responseFormatter({
              status: 'error',
              message: 'Staff profile not found'
            }));
          }
          break;
        case 'doctor':
          if (!req.doctorProfile) {
            return res.status(403).json(responseFormatter({
              status: 'error',
              message: 'Doctor profile not found'
            }));
          }
          break;
        case 'patient':
          if (!req.patientProfile) {
            return res.status(403).json(responseFormatter({
              status: 'error',
              message: 'Patient profile not found'
            }));
          }
          break;
      }

      next();
    } catch (err) {
      console.error('Role check error:', err.message);
      res.status(500).json(responseFormatter({
        status: 'error',
        message: 'Internal server error during role check',
        errors: [err.message]
      }));
    }
  };
};

module.exports = roleCheck;
