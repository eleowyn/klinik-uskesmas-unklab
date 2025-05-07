const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { responseFormatter } = require('../utils/responseFormatter');

exports.fixPatientDoctorAssignments = async (req, res) => {
  try {
    // Find the logged-in doctor by user ID
    const doctorProfile = await Doctor.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor profile not found for the logged-in user'
      }));
    }

    // Get all patients
    const patients = await Patient.find().lean();

    let assignedCount = 0;
    let alreadyAssignedCount = 0;

    for (const patient of patients) {
      if (!patient.doctors || patient.doctors.length === 0) {
        await Patient.findByIdAndUpdate(patient._id, {
          $addToSet: { doctors: doctorProfile._id }
        });
        assignedCount++;
      } else {
        alreadyAssignedCount++;
      }
    }

    // Update the doctor's patients array
    const patientsWithDoctor = await Patient.find({ doctors: doctorProfile._id });
    await Doctor.findByIdAndUpdate(doctorProfile._id, {
      $set: { patients: patientsWithDoctor.map(p => p._id) }
    });

    res.json(responseFormatter({
      status: 'success',
      message: 'Patient-doctor assignments fixed for logged-in doctor',
      data: {
        totalPatients: patients.length,
        newlyAssignedPatients: assignedCount,
        previouslyAssignedPatients: alreadyAssignedCount
      }
    }));
  } catch (error) {
    console.error('Error fixing patient-doctor assignments:', error);
    res.status(500).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};
