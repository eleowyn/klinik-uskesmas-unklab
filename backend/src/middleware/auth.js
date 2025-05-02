const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const Staff = require('../models/Staff');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { responseFormatter } = require('../utils/responseFormatter');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json(responseFormatter({
        status: 'error',
        message: 'No token, authorization denied'
      }));
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json(responseFormatter({
        status: 'error',
        message: 'User not found'
      }));
    }

    // Get role-specific profile
    let profile = null;
    switch (user.role) {
      case 'staff':
        profile = await Staff.findOne({ user: user._id }).populate('user');
        if (!profile) {
          return res.status(401).json(responseFormatter({
            status: 'error',
            message: 'Staff profile not found'
          }));
        }
        req.staffProfile = profile;
        break;
      case 'doctor':
        profile = await Doctor.findOne({ user: user._id }).populate('user');
        if (!profile) {
          return res.status(401).json(responseFormatter({
            status: 'error',
            message: 'Doctor profile not found'
          }));
        }
        req.doctorProfile = profile;
        break;
      case 'patient':
        profile = await Patient.findOne({ user: user._id }).populate('user');
        if (!profile) {
          return res.status(401).json(responseFormatter({
            status: 'error',
            message: 'Patient profile not found'
          }));
        }
        req.patientProfile = profile;
        break;
    }

    // Add user to request object
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      profile
    };

    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json(responseFormatter({
      status: 'error',
      message: 'Token is not valid',
      errors: [err.message]
    }));
  }
};

module.exports = auth;
