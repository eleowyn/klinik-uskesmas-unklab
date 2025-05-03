const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require('../services/authService');
const { responseFormatter } = require('../utils/responseFormatter');
const Staff = require('../models/Staff');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json(responseFormatter({
        status: 'error',
        message: 'Please provide all required fields: username, email, password, role'
      }));
    }

    // Pass data to registerUser service
    const { user, profile, token } = await registerUser(req.body);
   
    res.status(201).json(responseFormatter({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          ...(profile && { [`${role}Profile`]: profile })
        }
      }
    }));
  } catch (err) {
    // Log the error for debugging
    console.error('Registration error:', err);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json(responseFormatter({
        status: 'error',
        message: 'Please provide both email and password'
      }));
    }

    const { user, token } = await loginUser(email, password);
    
    // Get role-specific profile
    let profile = null;
    switch (user.role) {
      case 'staff':
        profile = await Staff.findOne({ user: user._id }).populate('user');
        break;
      case 'doctor':
        profile = await Doctor.findOne({ user: user._id }).populate('user');
        break;
      case 'patient':
        profile = await Patient.findOne({ user: user._id }).populate('user');
        break;
    }

    if (!profile) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: `${user.role} profile not found`
      }));
    }

    res.status(200).json(responseFormatter({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          [`${user.role}Profile`]: profile
        }
      }
    }));
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id);
    
    // Get role-specific profile
    let profile = null;
    switch (user.role) {
      case 'staff':
        profile = await Staff.findOne({ user: user._id }).populate('user');
        break;
      case 'doctor':
        profile = await Doctor.findOne({ user: user._id }).populate('user');
        break;
      case 'patient':
        profile = await Patient.findOne({ user: user._id }).populate('user');
        break;
    }

    if (!profile) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: `${user.role} profile not found`
      }));
    }

    res.status(200).json(responseFormatter({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          [`${user.role}Profile`]: profile
        }
      }
    }));
  } catch (err) {
    console.error('Get current user error:', err);
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
