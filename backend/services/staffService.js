const Staff = require('../models/Staff');

const staffService = {
  login: async (username, password) => {
    try {
      const staff = await Staff.findOne({ username });
      if (!staff) {
        return null;
      }

      if (password !== staff.password) {
        return null;
      }

      return staff;
    } catch (error) {
      throw new Error('Error during login: ' + error.message);
    }
  },

  create: async (staffData) => {
    try {
      const staff = new Staff(staffData);
      return await staff.save();
    } catch (error) {
      throw new Error('Error creating staff: ' + error.message);
    }
  },

  findAll: async () => {
    try {
      return await Staff.find();
    } catch (error) {
      throw new Error('Error fetching staff: ' + error.message);
    }
  },

  findById: async (id) => {
    try {
      return await Staff.findById(id);
    } catch (error) {
      throw new Error('Error fetching staff by id: ' + error.message);
    }
  },

  update: async (id, staffData) => {
    try {
      return await Staff.findByIdAndUpdate(id, staffData, { new: true });
    } catch (error) {
      throw new Error('Error updating staff: ' + error.message);
    }
  },

  delete: async (id) => {
    try {
      return await Staff.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error deleting staff: ' + error.message);
    }
  },
};

module.exports = staffService;