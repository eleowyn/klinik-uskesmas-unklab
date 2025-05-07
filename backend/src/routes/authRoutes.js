const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');
const config = require('../config');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      console.log('Missing credentials:', { email: !!email, password: !!password });
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Find user with explicit password selection
    const user = await User.findOne({ email })
      .select('+password')
      .exec();

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Debug password field
    console.log('User found, password exists:', !!user.password);
    
    // Ensure password exists in user document
    if (!user.password) {
      console.error('User found but password is missing in database for:', email);
      return res.status(500).json({
        status: 'error',
        message: 'Authentication error'
      });
    }

    // Use the model's comparePassword method instead of direct bcrypt.compare
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Find profile based on role
    let profile;
    if (user.role === 'doctor') {
      profile = await Doctor.findOne({ user: user._id });
    } else if (user.role === 'staff') {
      profile = await Staff.findOne({ user: user._id });
    } else if (user.role === 'patient') {
      profile = await Patient.findOne({ user: user._id });
    }

    if (!profile) {
      return res.status(400).json({
        status: 'error',
        message: 'Profile not found'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from user object
    const userObject = user.toObject();
    delete userObject.password;

    // Send response
    res.json({
      status: 'success',
      data: {
        token,
        user: {
          ...userObject,
          profile: profile.toObject()
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed'
    });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, ...profileData } = req.body;

    // Allow registration for doctor and staff roles only
    if (role !== 'doctor' && role !== 'staff') {
      return res.status(403).json({
        status: 'error',
        message: 'Registration allowed only for doctor and staff roles.'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    // Remove employeeId from staff profileData as it will be auto-generated in database
    if (role === 'staff') {
      if ('employeeId' in profileData) {
        delete profileData.employeeId;
      }
    }

    // Create user
    const user = new User({
      email,
      password,
      role
    });
    await user.save();

    // Create profile
    let profile;
    if (role === 'doctor') {
      profile = new Doctor({ ...profileData, user: user._id });
    } else if (role === 'staff') {
      profile = new Staff({ ...profileData, user: user._id });
    }
    await profile.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from user object
    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          ...userObject,
          profile: profile.toObject()
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    // Log detailed validation errors if any
    if (error.name === 'ValidationError') {
      for (const field in error.errors) {
        console.error(`Validation error for ${field}:`, error.errors[field].message);
      }
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    let profile;
    if (user.role === 'doctor') {
      profile = await Doctor.findOne({ user: user._id });
    } else if (user.role === 'staff') {
      profile = await Staff.findOne({ user: user._id });
    } else if (user.role === 'patient') {
      profile = await Patient.findOne({ user: user._id });
    }

    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        user: {
          ...user.toObject(),
          profile: profile.toObject()
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user'
    });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { password, email, role, ...updateData } = req.body;

    let profile;
    if (req.user.role === 'doctor') {
      profile = await Doctor.findOneAndUpdate(
        { user: req.user.id },
        updateData,
        { new: true }
      );
    } else if (req.user.role === 'staff') {
      profile = await Staff.findOneAndUpdate(
        { user: req.user.id },
        updateData,
        { new: true }
      );
    } else if (req.user.role === 'patient') {
      profile = await Patient.findOneAndUpdate(
        { user: req.user.id },
        updateData,
        { new: true }
      );
    }

    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found'
      });
    }

    res.json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
});

module.exports = router;
