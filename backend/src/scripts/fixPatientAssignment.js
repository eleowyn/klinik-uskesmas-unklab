const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const connectDB = require('../config/db');

async function fixPatientAssignment() {
  try {
    await connectDB();

    // Get the doctor (there should be only one)
    const doctor = await Doctor.findOne();
    if (!doctor) {
      console.error('No doctor found in the database');
      process.exit(1);
    }

    console.log('Found doctor:', {
      id: doctor._id,
      name: doctor.fullName
    });

    // Get all patients
    const patients = await Patient.find();
    console.log('Total patients found:', patients.length);

    let assignedCount = 0;

    // Assign each patient to the doctor if not already assigned
    for (const patient of patients) {
      if (!patient.doctors.includes(doctor._id)) {
        patient.doctors.push(doctor._id);
        await patient.save();
        assignedCount++;
        console.log(`Assigned patient ${patient.fullName} (${patient._id}) to doctor`);
      } else {
        console.log(`Patient ${patient.fullName} already assigned to doctor`);
      }
    }

    console.log(`\nSummary:`);
    console.log(`Total patients: ${patients.length}`);
    console.log(`Newly assigned patients: ${assignedCount}`);
    console.log(`Previously assigned patients: ${patients.length - assignedCount}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing patient assignments:', error);
    process.exit(1);
  }
}

fixPatientAssignment();
