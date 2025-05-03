const mongoose = require('mongoose');
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
    if (!userId) {
      throw new Error('User ID is required');
    }
    console.log('Finding patient by user ID:', userId);
    const patient = await Patient.findOne({ user: userId })
      .populate('user', '-password')
      .populate('doctors', 'fullName specialization');
    console.log('Patient found:', patient ? patient._id : 'none');
    return patient;
  } catch (error) {
    console.error('Error finding patient by user ID:', error);
    throw error;
  }
};

const findPatientById = async (id) => {
  try {
    if (!id) {
      throw new Error('Patient ID is required');
    }
    console.log('Finding patient by ID:', id);
    const patient = await Patient.findById(id)
      .populate('user', '-password')
      .populate('doctors', 'fullName specialization');
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
    const patients = await Patient.find()
      .populate('user', '-password')
      .populate('doctors', 'fullName specialization');
    console.log('Found', patients.length, 'patients');
    return patients;
  } catch (error) {
    console.error('Error finding all patients:', error);
    throw error;
  }
};

const findByDoctor = async (doctorId) => {
  try {
    console.log('findByDoctor - Starting search for doctor:', doctorId);
    
    if (!doctorId) {
      console.error('findByDoctor - No doctor ID provided');
      throw new Error('Doctor ID is required');
    }

    // Validate doctorId format
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      console.error('findByDoctor - Invalid doctor ID format:', doctorId);
      throw new Error('Invalid doctor ID format');
    }

    // Convert string ID to ObjectId
    const searchDoctorId = new mongoose.Types.ObjectId(doctorId);

    console.log('findByDoctor - Searching with ObjectId:', searchDoctorId);

    const patients = await Patient.find({ doctors: searchDoctorId })
      .select({
        _id: 1,
        fullName: 1,
        gender: 1,
        phoneNumber: 1,
        dateOfBirth: 1,
        updatedAt: 1
      })
      .lean()
      .exec();

    console.log('findByDoctor - Results:', {
      doctorId: searchDoctorId,
      patientsFound: patients.length,
      samplePatient: patients[0] ? {
        id: patients[0]._id,
        name: patients[0].fullName,
        fields: Object.keys(patients[0])
      } : 'none'
    });

    if (patients.length === 0) {
      console.log('findByDoctor - No patients found for doctor:', doctorId);
    }

    return patients;
  } catch (error) {
    console.error('findByDoctor - Error:', error);
    throw new Error(`Failed to find patients: ${error.message}`);
  }
};

const updatePatient = async (id, updateData) => {
  try {
    if (!id) {
      throw new Error('Patient ID is required');
    }
    console.log('Updating patient:', id, 'with data:', updateData);
    const patient = await Patient.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    })
    .populate('user', '-password')
    .populate('doctors', 'fullName specialization');
    
    console.log('Patient updated:', patient ? patient._id : 'none');
    return patient;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

const deletePatient = async (id) => {
  try {
    if (!id) {
      throw new Error('Patient ID is required');
    }
    console.log('Deleting patient:', id);
    const patient = await Patient.findByIdAndDelete(id);
    console.log('Patient deleted:', patient ? patient._id : 'none');
    return patient;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

const addDoctorToPatient = async (patientId, doctorId) => {
  try {
    if (!patientId || !doctorId) {
      throw new Error('Patient ID and Doctor ID are required');
    }
    console.log('Adding doctor', doctorId, 'to patient:', patientId);
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $addToSet: { doctors: doctorId } },
      { 
        new: true,
        runValidators: true 
      }
    )
    .populate('user', '-password')
    .populate('doctors', 'fullName specialization');
    
    console.log('Doctor added to patient:', patient ? patient._id : 'none');
    return patient;
  } catch (error) {
    console.error('Error adding doctor to patient:', error);
    throw error;
  }
};

const removeDoctorFromPatient = async (patientId, doctorId) => {
  try {
    if (!patientId || !doctorId) {
      throw new Error('Patient ID and Doctor ID are required');
    }
    console.log('Removing doctor', doctorId, 'from patient:', patientId);
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $pull: { doctors: doctorId } },
      { 
        new: true,
        runValidators: true 
      }
    )
    .populate('user', '-password')
    .populate('doctors', 'fullName specialization');
    
    console.log('Doctor removed from patient:', patient ? patient._id : 'none');
    return patient;
  } catch (error) {
    console.error('Error removing doctor from patient:', error);
    throw error;
  }
};

module.exports = {
  createPatient,
  findPatientByUserId,
  findPatientById,
  findAllPatients,
  findByDoctor,
  updatePatient,
  deletePatient,
  addDoctorToPatient,
  removeDoctorFromPatient
};
