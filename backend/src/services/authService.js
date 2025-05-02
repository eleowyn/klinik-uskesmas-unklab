const jwt = require('jsonwebtoken');
const config = require('../config');
const { 
  createUser, 
  findUserByUsername, 
  findUserByEmail,
  findUserById,
} = require('../repositories/userRepository');
const { createPatient, findPatientByUserId } = require('../repositories/patientRepository');
const { createDoctor, findDoctorByUserId } = require('../repositories/doctorRepository');
const { create: createStaff, findStaffByUserId } = require('../repositories/staffRepository');

const registerUser = async (userData) => {
  try {
    // Validate required fields
    if (!userData.username || !userData.email || !userData.password || !userData.role) {
      throw new Error('Please provide all required fields');
    }

    // Check if username or email already exists
    const [existingUser, existingEmail] = await Promise.all([
      findUserByUsername(userData.username),
      findUserByEmail(userData.email)
    ]);

    if (existingUser) {
      throw new Error('Username already exists');
    }

    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Create user
    const user = await createUser({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role
    });

    // Create role-specific profile
    let profile;
    try {
      switch (userData.role) {
        case 'patient':
          profile = await createPatient({
            user: user._id,
            fullName: userData.fullName || userData.username,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            address: userData.address,
            phoneNumber: userData.phoneNumber
          });
          break;
        case 'doctor':
          profile = await createDoctor({
            user: user._id,
            name: userData.fullName || userData.username,
            specialization: userData.specialization,
            qualifications: userData.qualifications
          });
          break;
        case 'staff':
          profile = await createStaff({
            user: user._id,
            fullName: userData.fullName || userData.username,
            position: userData.position || 'staff',
            department: userData.department
          });
          break;
        default:
          throw new Error('Invalid role specified');
      }
    } catch (profileError) {
      // If profile creation fails, delete the created user
      await user.deleteOne();
      throw new Error(`Failed to create ${userData.role} profile: ${profileError.message}`);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return { user, profile, token };
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Get role-specific profile
    let profile = null;
    switch (user.role) {
      case 'staff':
        profile = await findStaffByUserId(user._id);
        break;
      case 'doctor':
        profile = await findDoctorByUserId(user._id);
        break;
      case 'patient':
        profile = await findPatientByUserId(user._id);
        break;
    }

    if (!profile) {
      throw new Error(`${user.role} profile not found`);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return { user, profile, token };
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};

const generateToken = (userId) => {
  try {
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Error generating authentication token');
  }
};

const getCurrentUser = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get role-specific profile
    let profile = null;
    switch (user.role) {
      case 'staff':
        profile = await findStaffByUserId(user._id);
        break;
      case 'doctor':
        profile = await findDoctorByUserId(user._id);
        break;
      case 'patient':
        profile = await findPatientByUserId(user._id);
        break;
    }

    if (!profile) {
      throw new Error(`${user.role} profile not found`);
    }

    return { ...user.toObject(), profile };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
