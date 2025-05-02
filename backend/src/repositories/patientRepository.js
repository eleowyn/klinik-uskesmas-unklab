const Patient = require('../models/Patient');

const createPatient = async (patientData) => {
  try {
    console.log('Creating patient with data:', patientData);
    const patient = new Patient(patientData);
    await patient.save();
    console.log('Patient created successfully:', patient._id);
    return patient;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

const findPatientByUserId = async (userId) => {
  try {
    console.log('Finding patient by user ID:', userId);
    const patient = await Patient.findOne({ user: userId }).populate('user');
    console.log('Patient found:', patient ? patient._id : 'none');
    return patient;
  } catch (error) {
    console.error('Error finding patient by user ID:', error);
    throw error;
  }
};

const findPatientById = async (id) => {
  try {
    console.log('Finding patient by ID:', id);
    const patient = await Patient.findById(id);
    console.log('Patient found:', patient ? patient._id : 'none');
    return patient;
  } catch (error) {
    console.error('Error finding patient by ID:', error);
    throw error;
  }
};

const findAllPatients = async () => {
  try {
    console.log('Finding all patients');
    const patients = await Patient.find();
    console.log('Found', patients.length, 'patients');
    return patients;
  } catch (error) {
    console.error('Error finding all patients:', error);
    throw error;
  }
};

const updatePatient = async (id, updateData) => {
  try {
    console.log('Updating patient:', id, 'with data:', updateData);
    const patient = await Patient.findByIdAndUpdate(id, updateData, { new: true });
    console.log('Patient updated:', patient ? patient._id : 'none');
    return patient;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

const deletePatient = async (id) => {
  try {
    console.log('Deleting patient:', id);
    const patient = await Patient.findByIdAndDelete(id);
    console.log('Patient deleted:', patient ? patient._id : 'none');
    return patient;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

module.exports = {
  createPatient,
  findPatientByUserId,
  findPatientById,
  findAllPatients,
  updatePatient,
  deletePatient,
};
