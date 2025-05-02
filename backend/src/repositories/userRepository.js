const User = require('../models/User');

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    
    // Validate user data before saving
    const validationError = user.validateSync();
    if (validationError) {
      const errorMessage = Object.values(validationError.errors)
        .map(error => error.message)
        .join(', ');
      throw new Error(`Validation failed: ${errorMessage}`);
    }

    await user.save();
    return user;
  } catch (error) {
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw new Error(`${field} already exists`);
    }
    // Re-throw other errors
    throw error;
  }
};

const findUserByUsername = async (username) => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    throw new Error(`Error finding user by username: ${error.message}`);
  }
};

const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
};

const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error finding user by id: ${error.message}`);
  }
};

const updateUser = async (id, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw new Error(`${field} already exists`);
    }
    throw new Error(`Error updating user: ${error.message}`);
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
};
