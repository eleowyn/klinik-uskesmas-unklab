const Doctor = require('../models/Doctor');

const createDoctor = async (doctorData) => {
  const doctor = new Doctor(doctorData);
  await doctor.save();
  return doctor;
};

const findDoctorByUserId = async (userId) => {
  return await Doctor.findOne({ user: userId }).populate('user');
};

const findDoctorById = async (id) => {
  return await Doctor.findById(id).populate('user');
};

const findAllDoctors = async () => {
  return await Doctor.find().populate('user');
};

const updateDoctor = async (id, updateData) => {
  return await Doctor.findByIdAndUpdate(id, updateData, { new: true }).populate('user');
};

const deleteDoctor = async (id) => {
  return await Doctor.findByIdAndDelete(id);
};

module.exports = {
  createDoctor,
  findDoctorByUserId,
  findDoctorById,
  findAllDoctors,
  updateDoctor,
  deleteDoctor,
};