const {
    findPatientByUserId,
    findPatientById,
    findAllPatients,
    updatePatient,
  } = require('../repositories/patientRepository');
  
  const getPatientProfile = async (userId) => {
    return await findPatientByUserId(userId);
  };
  
  const getPatientById = async (patientId) => {
    return await findPatientById(patientId);
  };
  
  const getAllPatients = async () => {
    return await findAllPatients();
  };
  
  const updatePatientProfile = async (patientId, updateData) => {
    return await updatePatient(patientId, updateData);
  };
  
  module.exports = {
    getPatientProfile,
    getPatientById,
    getAllPatients,
    updatePatientProfile,
  };