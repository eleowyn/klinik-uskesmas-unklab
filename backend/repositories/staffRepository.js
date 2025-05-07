const Staff = require('../models/Staff');

class StaffRepository {
  async findByUsername(username) {
    return await Staff.findOne({ username });
  }

  async findById(id) {
    return await Staff.findById(id);
  }

  async create(staffData) {
    const staff = new Staff(staffData);
    return await staff.save();
  }

  async update(id, updateData) {
    return await Staff.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Staff.findByIdAndDelete(id);
  }

  async findAll() {
    return await Staff.find();
  }
}

module.exports = new StaffRepository();