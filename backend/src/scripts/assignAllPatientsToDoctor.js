const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const connectDB = require('../config/db');

async function assignAllPatientsToDoctor(doctorUserId) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(doctorUserId)) {
      console.error('Invalid doctor user ID format:', doctorUserId);
      process.exit(1);
    }

    // Use new mongoose.Types.ObjectId() to create ObjectId instance
    const doctorUserObjectId = new mongoose.Types.ObjectId(doctorUserId);

    const doctor = await Doctor.findOne({ user: doctorUserObjectId });
    if (!doctor) {
      console.error('Doctor not found for user ID:', doctorUserId);
      process.exit(1);
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

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error assigning patients to doctor:', error);
    process.exit(1);
  }
}

// Set the actual doctor user ID to assign patients to
const doctorUserId = '6815f89dc2a3e80d7dd354c4';

assignAllPatientsToDoctor(doctorUserId);
