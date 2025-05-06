const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const connectDB = require('../config/db');

async function assignAllPatientsToDoctor(doctorUserId) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(doctorUserId)) {
      throw new Error('Invalid doctor user ID format: ' + doctorUserId);
    }

    const doctorUserObjectId = new mongoose.Types.ObjectId(doctorUserId);

    const doctor = await Doctor.findOne({ user: doctorUserObjectId });
    if (!doctor) {
      throw new Error('Doctor not found for user ID: ' + doctorUserId);
    }

    console.log('Assigning patients to doctor:', doctor._id);

    const patients = await Patient.find();
    console.log('Total patients found:', patients.length);

    let assignedCount = 0;

    for (const patient of patients) {
      if (!patient.doctors.includes(doctor._id)) {
        patient.doctors.push(doctor._id);
        await patient.save();
        assignedCount++;
        console.log(`Assigned patient ${patient._id} to doctor`);
      }
    }

    console.log(`Total patients assigned to doctor: ${assignedCount}`);

    // await mongoose.connection.close(); // Removed to avoid closing shared connection
    return assignedCount;
  } catch (error) {
    console.error('Error assigning patients to doctor:', error);
    throw error;
  }
}

async function assignDoctorToPatient(patientId, doctorUserId) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(doctorUserId)) {
      throw new Error('Invalid doctor user ID format: ' + doctorUserId);
    }
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      throw new Error('Invalid patient ID format: ' + patientId);
    }

    const doctorUserObjectId = new mongoose.Types.ObjectId(doctorUserId);
    const patientObjectId = new mongoose.Types.ObjectId(patientId);

    const doctor = await Doctor.findOne({ user: doctorUserObjectId });
    if (!doctor) {
      throw new Error('Doctor not found for user ID: ' + doctorUserId);
    }

    const patient = await Patient.findById(patientObjectId);
    if (!patient) {
      throw new Error('Patient not found for ID: ' + patientId);
    }

    if (!patient.doctors.includes(doctor._id)) {
      patient.doctors.push(doctor._id);
      await patient.save();
      console.log(`Assigned patient ${patient._id} to doctor ${doctor._id}`);
    } else {
      console.log(`Patient ${patient._id} already assigned to doctor ${doctor._id}`);
    }

    // await mongoose.connection.close(); // Removed to avoid closing shared connection
    return patient;
  } catch (error) {
    console.error('Error assigning doctor to patient:', error);
    throw error;
  }
}

module.exports = {
  assignAllPatientsToDoctor,
  assignDoctorToPatient,
};
