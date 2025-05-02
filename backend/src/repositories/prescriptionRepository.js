const Prescription = require('../models/Prescription');

const createPrescription = async (prescriptionData) => {
  const prescription = new Prescription(prescriptionData);
  await prescription.save();
  return prescription;
};

const findPrescriptionById = async (id) => {
  return await Prescription.findById(id)
    .populate('patient')
    .populate('doctor');
};

const findPrescriptionsByPatient = async (patientId) => {
  return await Prescription.find({ patient: patientId })
    .populate('patient')
    .populate('doctor');
};

const findPrescriptionsByDoctor = async (doctorId) => {
  return await Prescription.find({ doctor: doctorId })
    .populate('patient')
    .populate('doctor');
};

const updatePrescription = async (id, updateData) => {
  return await Prescription.findByIdAndUpdate(id, updateData, { new: true })
    .populate('patient')
    .populate('doctor');
};

const deletePrescription = async (id) => {
  return await Prescription.findByIdAndDelete(id);
};

module.exports = {
  createPrescription,
  findPrescriptionById,
  findPrescriptionsByPatient,
  findPrescriptionsByDoctor,
  updatePrescription,
  deletePrescription,
};