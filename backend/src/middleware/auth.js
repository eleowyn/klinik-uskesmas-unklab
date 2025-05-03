const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');
const Patient = require('../models/Patient');
const config = require('../config');

/**
 * Authentication middleware
 * Verifies JWT token and sets user and role-specific profile on request object
 */
const auth = async (req, res, next) => {
  try {
    console.log('Auth - Request URL:', req.originalUrl);

    // Check for token in Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No authentication token provided');
    }
    console.log('Auth - Token present:', !!token);

    // Verify token with JWT_SECRET from config
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log('Auth - Decoded token user ID:', decoded.userId);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    console.log('Auth - Found user:', {
      id: user._id,
      role: user.role,
      email: user.email
    });

    // Set base user info
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email
    };

    // Find role-specific profile
    let profile = null;
    if (user.role === 'doctor') {
      profile = await Doctor.findOne({ user: user._id });
    } else if (user.role === 'staff') {
      profile = await Staff.findOne({ user: user._id });
    } else if (user.role === 'patient') {
      profile = await Patient.findOne({ user: user._id });
    }

    console.log('Auth - Profile found:', !!profile, 'ID:', profile?._id);

    // Set profile if found
    if (profile) {
      req[`${user.role}Profile`] = profile;
    }

    // Log success
    console.log('Auth - Successfully set user and profile:', {
      role: user.role,
      hasUserProfile: !!profile,
      hasRoleProfile: !!req[`${user.role}Profile`]
    });

    next();
  } catch (error) {
    console.error('Auth - Error:', error.message);
    res.status(401).json({
      status: 'error',
      message: 'Please authenticate',
      error: error.message
    });
  }
};

module.exports = auth;
