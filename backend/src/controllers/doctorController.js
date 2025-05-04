const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const { responseFormatter } = require('../utils/responseFormatter');

// Profile
exports.getProfile = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user.id })
      .populate('user', '-password')
      .lean();

    if (!doctorProfile) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor profile not found'
      }));
    }

    // Get actual counts from collections with populated data
    const [patients, appointments] = await Promise.all([
      Patient.find({ doctors: doctorProfile._id })
        .lean()
        .populate('user', '-password'),
      Appointment.find({ doctor: doctorProfile._id })
        .lean()
        .populate({
          path: 'patient',
          select: 'fullName'
        })
    ]);

    // Update the profile with actual data
    doctorProfile.patients = patients;
    doctorProfile.appointments = appointments;

    console.log(`Found ${patients.length} patients and ${appointments.length} appointments for doctor ${doctorProfile._id}`);

    res.json(responseFormatter({
      status: 'success',
      data: doctorProfile
    }));
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

// Patients
exports.getPatients = async (req, res) => {
  try {
    // Use the doctorProfile that was attached by roleCheck middleware
    const doctorProfile = req.doctorProfile;
    
    if (!doctorProfile) {
      console.error('Doctor profile not found in middleware');
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor profile not found'
      }));
    }
    
    console.log('getPatients - Using doctorProfile from middleware:', {
      doctorId: doctorProfile._id,
      userId: req.user.id,
      name: doctorProfile.fullName
    });

    // Use lean() for better performance and convert to plain JavaScript objects
    console.log('Finding patients for doctor:', doctorProfile._id);
    
    const patients = await Patient.find({ 
      doctors: doctorProfile._id 
    })
    .lean()
    .populate('user', '-password')
    .sort({ fullName: 1 });

    console.log('Patient query results:', {
      doctorId: doctorProfile._id,
      patientsFound: patients.length,
      patientIds: patients.map(p => p._id),
      patients: patients.map(p => ({
        id: p._id,
        name: p.fullName,
        doctors: p.doctors
      }))
    });

    // Return the raw patients array without wrapping in data property
    res.json(patients);
  } catch (error) {
    console.error('Error in getPatients:', error);
    res.status(500).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

// Assign patient to doctor
exports.assignPatientToDoctor = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor profile not found'
      }));
    }

    const patientId = req.params.patientId;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Patient not found'
      }));
    }

    // Check if doctor is already assigned
    if (patient.doctors.includes(doctorProfile._id)) {
      return res.status(400).json(responseFormatter({
        status: 'error',
        message: 'Doctor already assigned to this patient'
      }));
    }

    // Add doctor to patient's doctors array
    patient.doctors.push(doctorProfile._id);
    await patient.save();

    res.json(responseFormatter({
      status: 'success',
      message: 'Doctor assigned to patient successfully',
      data: patient
    }));
  } catch (error) {
    console.error('Error in assignPatientToDoctor:', error);
    res.status(500).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

exports.getPatientDetails = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor profile not found'
      }));
    }

    const patient = await Patient.findById(req.params.id)
      .populate('user', '-password');

    if (!patient) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Patient not found'
      }));
    }

    if (!patient.doctors.includes(doctorProfile._id)) {
      return res.status(403).json(responseFormatter({
        status: 'error',
        message: 'Not authorized to view this patient'
      }));
    }

    res.json(responseFormatter({
      status: 'success',
      data: patient
    }));
  } catch (error) {
    console.error('Error in getPatientDetails:', error);
    res.status(500).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

// Prescriptions
exports.getPrescriptions = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor profile not found'
      }));
    }

    const prescriptions = await Prescription.find({ doctor: doctorProfile._id })
      .lean()
      .populate({
        path: 'patient',
        select: 'fullName'
      })
      .sort({ date: -1 });

    res.json(responseFormatter({
      status: 'success',
      data: prescriptions
    }));
  } catch (error) {
    console.error('Error in getPrescriptions:', error);
    res.status(500).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

exports.getPrescriptionDetails = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user.id });
    if (!doctorProfile) {
      console.error('Doctor profile not found for user:', req.user.id);
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor profile not found'
      }));
    }

    console.log(`Fetching prescription ${req.params.id} for doctor ${doctorProfile._id}`);

    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctor: doctorProfile._id
    })
    .populate({
      path: 'patient',
      select: 'fullName gender dateOfBirth'
    })
    .lean();  // Convert to plain JavaScript object for better performance

    if (!prescription) {
      console.error(`Prescription ${req.params.id} not found for doctor ${doctorProfile._id}`);
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Prescription not found'
      }));
    }

    res.json(responseFormatter({
      status: 'success',
      data: prescription
    }));
  } catch (error) {
    console.error('Error in getPrescriptionDetails:', error);
    res.status(500).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor profile not found'
      }));
    }

    const prescription = new Prescription({
      ...req.body,
      doctor: doctorProfile._id,
      date: new Date()
    });

    await prescription.save();

    res.status(201).json(responseFormatter({
      status: 'success',
      data: prescription
    }));
  } catch (error) {
    console.error('Error in createPrescription:', error);
    res.status(500).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

// Appointments
exports.getAppointments = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor profile not found'
      }));
    }

    // Use lean() for better performance and populate patient details
    const appointments = await Appointment.find({ 
      doctor: doctorProfile._id
    })
    .lean()
    .populate({
      path: 'patient',
      select: 'fullName'
    })
    .sort({ date: 1 });

    console.log(`Found ${appointments.length} appointments for doctor ${doctorProfile._id}`);

    res.json(responseFormatter({
      status: 'success',
      data: appointments
    }));
  } catch (error) {
    console.error('Error in getAppointments:', error);
    res.status(500).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor profile not found'
      }));
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: doctorProfile._id
    });

    if (!appointment) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Appointment not found'
      }));
    }

    Object.assign(appointment, req.body);
    await appointment.save();

    res.json(responseFormatter({
      status: 'success',
      data: appointment
    }));
  } catch (error) {
    console.error('Error in updateAppointment:', error);
    res.status(500).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

// Schedule
exports.getSchedule = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor profile not found'
      }));
    }

    const { startDate, endDate } = req.query;
    const query = {
      doctor: doctorProfile._id,
      date: {}
    };

    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);

    const appointments = await Appointment.find(query)
      .lean()
      .populate({
        path: 'patient',
        select: 'fullName'
      })
      .sort({ date: 1 });

    res.json(responseFormatter({
      status: 'success',
      data: appointments
    }));
  } catch (error) {
    console.error('Error in getSchedule:', error);
    res.status(500).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};
