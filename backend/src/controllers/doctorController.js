const doctorService = require('../services/doctorService');
const { responseFormatter } = require('../utils/responseFormatter');

const getProfile = async (req, res) => {
  try {
    console.log('Getting doctor profile for user:', req.user.id);
    const profile = await doctorService.getDoctorProfile(req.user.id);
    res.json(responseFormatter({
      status: 'success',
      data: profile
    }));
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const getDoctor = async (req, res) => {
  try {
    console.log('Getting doctor by ID:', req.params.id);
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Doctor not found'
      }));
    }
    res.json(responseFormatter({
      status: 'success',
      data: doctor
    }));
  } catch (error) {
    console.error('Error in getDoctor:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const getDoctors = async (req, res) => {
  try {
    console.log('Getting all doctors');
    const doctors = await doctorService.getAllDoctors();
    res.json(responseFormatter({
      status: 'success',
      data: doctors
    }));
  } catch (error) {
    console.error('Error in getDoctors:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log('Updating doctor profile:', req.doctorProfile._id);
    const updatedProfile = await doctorService.updateDoctorProfile(req.doctorProfile._id, req.body);
    res.json(responseFormatter({
      status: 'success',
      data: updatedProfile
    }));
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const getDoctorPatients = async (req, res) => {
  try {
    console.log('Getting patients for doctor:', req.doctorProfile._id);
    const patients = await doctorService.getDoctorPatients(req.doctorProfile._id);
    res.json(responseFormatter({
      status: 'success',
      data: patients
    }));
  } catch (error) {
    console.error('Error in getDoctorPatients:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const getPatientDetails = async (req, res) => {
  try {
    console.log('Getting patient details:', req.params.id, 'for doctor:', req.doctorProfile._id);
    const patient = await doctorService.getPatientDetails(req.doctorProfile._id, req.params.id);
    if (!patient) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Patient not found'
      }));
    }
    res.json(responseFormatter({
      status: 'success',
      data: patient
    }));
  } catch (error) {
    console.error('Error in getPatientDetails:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const createPrescription = async (req, res) => {
  try {
    console.log('Creating prescription for doctor:', req.doctorProfile._id);
    const prescription = await doctorService.createPrescription(req.doctorProfile._id, req.body);
    res.status(201).json(responseFormatter({
      status: 'success',
      data: prescription
    }));
  } catch (error) {
    console.error('Error in createPrescription:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const getPrescriptions = async (req, res) => {
  try {
    console.log('Getting prescriptions for doctor:', req.doctorProfile._id);
    const prescriptions = await doctorService.getDoctorPrescriptions(req.doctorProfile._id);
    res.json(responseFormatter({
      status: 'success',
      data: prescriptions
    }));
  } catch (error) {
    console.error('Error in getPrescriptions:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const getPrescription = async (req, res) => {
  try {
    console.log('Getting prescription:', req.params.id, 'for doctor:', req.doctorProfile._id);
    const prescription = await doctorService.getPrescriptionDetails(req.doctorProfile._id, req.params.id);
    if (!prescription) {
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
    console.error('Error in getPrescription:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const updatePrescription = async (req, res) => {
  try {
    console.log('Updating prescription:', req.params.id, 'for doctor:', req.doctorProfile._id);
    const prescription = await doctorService.updatePrescription(req.doctorProfile._id, req.params.id, req.body);
    if (!prescription) {
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
    console.error('Error in updatePrescription:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    console.log('Getting appointments for doctor:', req.doctorProfile._id);
    const appointments = await doctorService.getDoctorAppointments(req.doctorProfile._id);
    res.json(responseFormatter({
      status: 'success',
      data: appointments
    }));
  } catch (error) {
    console.error('Error in getDoctorAppointments:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const createAppointment = async (req, res) => {
  try {
    console.log('Creating appointment for doctor:', req.doctorProfile._id);
    const appointment = await doctorService.createAppointment(req.doctorProfile._id, req.body);
    res.status(201).json(responseFormatter({
      status: 'success',
      data: appointment
    }));
  } catch (error) {
    console.error('Error in createAppointment:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const getAppointmentDetails = async (req, res) => {
  try {
    console.log('Getting appointment:', req.params.id, 'for doctor:', req.doctorProfile._id);
    const appointment = await doctorService.getAppointmentDetails(req.doctorProfile._id, req.params.id);
    if (!appointment) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Appointment not found'
      }));
    }
    res.json(responseFormatter({
      status: 'success',
      data: appointment
    }));
  } catch (error) {
    console.error('Error in getAppointmentDetails:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

const updateAppointment = async (req, res) => {
  try {
    console.log('Updating appointment:', req.params.id, 'for doctor:', req.doctorProfile._id);
    const appointment = await doctorService.updateAppointment(req.doctorProfile._id, req.params.id, req.body);
    if (!appointment) {
      return res.status(404).json(responseFormatter({
        status: 'error',
        message: 'Appointment not found'
      }));
    }
    res.json(responseFormatter({
      status: 'success',
      data: appointment
    }));
  } catch (error) {
    console.error('Error in updateAppointment:', error);
    res.status(400).json(responseFormatter({
      status: 'error',
      message: error.message
    }));
  }
};

module.exports = {
  getProfile,
  getDoctor,
  getDoctors,
  updateProfile,
  getDoctorPatients,
  getPatientDetails,
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription,
  getDoctorAppointments,
  createAppointment,
  getAppointmentDetails,
  updateAppointment
};
