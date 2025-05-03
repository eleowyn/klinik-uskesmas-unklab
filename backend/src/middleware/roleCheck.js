const { responseFormatter } = require('../utils/responseFormatter');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');
const Patient = require('../models/Patient');

const roleCheck = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json(responseFormatter({
          status: 'error',
          message: 'Authentication required'
        }));
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json(responseFormatter({
          status: 'error',
          message: 'Access denied'
        }));
      }

      // Attach role-specific profile to request
      switch (req.user.role) {
        case 'doctor':
          const doctorProfile = await Doctor.findOne({ user: req.user.id });
          if (!doctorProfile) {
            return res.status(404).json(responseFormatter({
              status: 'error',
              message: 'Doctor profile not found'
            }));
          }
          req.doctorProfile = doctorProfile;
          break;

        case 'staff':
          const staffProfile = await Staff.findOne({ user: req.user.id });
          if (!staffProfile) {
            return res.status(404).json(responseFormatter({
              status: 'error',
              message: 'Staff profile not found'
            }));
          }
          req.staffProfile = staffProfile;
          break;

        case 'patient':
          const patientProfile = await Patient.findOne({ user: req.user.id });
          if (!patientProfile) {
            return res.status(404).json(responseFormatter({
              status: 'error',
              message: 'Patient profile not found'
            }));
          }
          req.patientProfile = patientProfile;
          break;

        default:
          return res.status(403).json(responseFormatter({
            status: 'error',
            message: 'Invalid role'
          }));
      }

      // Add debug logging
      console.log('Role Check -', {
        userId: req.user.id,
        role: req.user.role,
        allowedRoles,
        path: req.path,
        method: req.method
      });

      next();
    } catch (error) {
      console.error('Role Check Error:', error);
      res.status(500).json(responseFormatter({
        status: 'error',
        message: 'Role check failed'
      }));
    }
  };
};

module.exports = roleCheck;
