const Staff = require('../models/Staff');
const User = require('../models/User');

/**
 * Find a staff member by their user ID
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} - The staff member document
 */
const findStaffByUserId = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  return await Staff.findOne({ user: userId }).populate('user');
};

/**
 * Find a staff member by their ID
 * @param {string} id - The staff member's ID
 * @returns {Promise<Object>} - The staff member document
 */
const findStaffById = async (id) => {
  return await Staff.findById(id).populate('user');
};

/**
 * Find a staff member by their email
 * @param {string} email - The staff member's email
 * @returns {Promise<Object>} - The staff member document
 */
const findByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return null;
  return await Staff.findOne({ user: user._id }).populate('user');
};

/**
 * Create a new staff member
 * @param {Object} staffData - The staff member data
 * @returns {Promise<Object>} - The created staff member document
 */
const create = async (staffData) => {
  const staff = new Staff(staffData);
  return await staff.save();
};

/**
 * Update a staff member by their ID
 * @param {string} id - The staff member's ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} - The updated staff member document
 */
const update = async (id, updateData) => {
  return await Staff.findByIdAndUpdate(id, updateData, { new: true }).populate('user');
};

/**
 * Delete a staff member by their ID
 * @param {string} id - The staff member's ID
 * @returns {Promise<Object>} - The deleted staff member document
 */
const remove = async (id) => {
  return await Staff.findByIdAndDelete(id);
};

/**
 * Get all staff members
 * @returns {Promise<Array>} - Array of staff member documents
 */
const getAll = async () => {
  return await Staff.find({}).populate('user');
};

module.exports = {
  findStaffByUserId,
  findStaffById,
  findByEmail,
  create,
  update,
  remove,
  getAll
};
