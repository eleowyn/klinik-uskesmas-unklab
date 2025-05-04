const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.userId);
      console.log('Auth Middleware - Token decoded:', {
        decodedUserId: decoded.userId,
        userFound: !!user,
        userRole: user?.role,
        userActive: user?.isActive
      });

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not found'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'User account is inactive'
        });
      }

      // Add user to request with explicit id field
      req.user = {
        id: user._id.toString(), // Ensure we're using string ID
        role: user.role,
        isActive: user.isActive
      };

      console.log('Auth Middleware - User set on request:', {
        userId: req.user.id,
        userRole: req.user.role
      });
      next();
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};

module.exports = auth;
