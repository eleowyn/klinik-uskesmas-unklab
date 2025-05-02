const {
    findDoctorByUserId,
    findDoctorById,
    findAllDoctors,
    updateDoctor,
  } = require('../repositories/doctorRepository');
  const {
    createPrescription,
    findPrescriptionsByDoctor,
    findPrescriptionById,
    updatePrescription,
  } = require('../repositories/prescriptionRepository');
  
  const getDoctorProfile = async (userId) => {
    return await findDoctorByUserId(userId);
  };
  
  const getDoctorById = async (doctorId) => {
    return await findDoctorById(doctorId);
  };
  
  const getAllDoctors = async () => {
    return await findAllDoctors();
  };
  
  const updateDoctorProfile = async (doctorId, updateData) => {
    return await updateDoctor(doctorId, updateData);
  };
  
  const createNewPrescription = async (prescriptionData) => {
    return await createPrescription(prescriptionData);
  };
  
  const getDoctorPrescriptions = async (doctorId) => {
    return await findPrescriptionsByDoctor(doctorId);
  };
  
  const getPrescriptionDetails = async (prescriptionId) => {
    return await findPrescriptionById(prescriptionId);
  };
  
  const updatePrescriptionDetails = async (prescriptionId, updateData) => {
    return await updatePrescription(prescriptionId, updateData);
  };
  
  module.exports = {
    getDoctorProfile,
    getDoctorById,
    getAllDoctors,
    updateDoctorProfile,
    createNewPrescription,
    getDoctorPrescriptions,
    getPrescriptionDetails,
    updatePrescriptionDetails,
  };