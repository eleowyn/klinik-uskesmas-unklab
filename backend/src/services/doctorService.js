const {
  findDoctorByUserId,
  findDoctorById,
  findAllDoctors,
  updateDoctor,
} = require('../repositories/doctorRepository');
const {
  createPrescription: createPrescriptionRepo,
  findPrescriptionsByDoctor,
  findPrescriptionById,
  updatePrescription: updatePrescriptionRepo,
} = require('../repositories/prescriptionRepository');
const {
  findByDoctor,
  findPatientById,
} = require('../repositories/patientRepository');
const {
  createAppointment: createAppointmentRepo,
  findAppointmentsByDoctor,
  findAppointmentById,
  updateAppointment: updateAppointmentRepo,
} = require('../repositories/appointmentRepository');

// Doctor Profile
const getDoctorProfile = async (userId) => {
  console.log('Getting doctor profile for user:', userId);
  const profile = await findDoctorByUserId(userId);
  if (!profile) {
    throw new Error('Doctor profile not found');
  }
  return profile;
};

const getDoctorById = async (doctorId) => {
  console.log('Getting doctor by ID:', doctorId);
  const doctor = await findDoctorById(doctorId);
  if (!doctor) {
    throw new Error('Doctor not found');
  }
  return doctor;
};

const getAllDoctors = async () => {
  console.log('Getting all doctors');
  return await findAllDoctors();
};

const updateDoctorProfile = async (doctorId, updateData) => {
  console.log('Updating doctor profile:', doctorId);
  const updated = await updateDoctor(doctorId, updateData);
  if (!updated) {
    throw new Error('Failed to update doctor profile');
  }
  return updated;
};

// Patients
const getDoctorPatients = async (doctorId) => {
  console.log('Getting patients for doctor:', doctorId);
  return await findByDoctor(doctorId);
};

const getPatientDetails = async (doctorId, patientId) => {
  console.log('Getting patient details:', patientId, 'for doctor:', doctorId);
  const patient = await findPatientById(patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }
  // Check if this patient belongs to the doctor
  if (!patient.doctors.includes(doctorId)) {
    throw new Error('Patient not associated with this doctor');
  }
  return patient;
};

// Prescriptions
const createPrescription = async (doctorId, prescriptionData) => {
  console.log('Creating prescription for doctor:', doctorId);
  return await createPrescriptionRepo({
    ...prescriptionData,
    doctor: doctorId,
    date: new Date()
  });
};

const getDoctorPrescriptions = async (doctorId) => {
  console.log('Getting prescriptions for doctor:', doctorId);
  return await findPrescriptionsByDoctor(doctorId);
};

const getPrescriptionDetails = async (doctorId, prescriptionId) => {
  console.log('Getting prescription details:', prescriptionId, 'for doctor:', doctorId);
  const prescription = await findPrescriptionById(prescriptionId);
  if (!prescription) {
    throw new Error('Prescription not found');
  }
  // Check if this prescription belongs to the doctor
  if (prescription.doctor.toString() !== doctorId.toString()) {
    throw new Error('Prescription not associated with this doctor');
  }
  return prescription;
};

const updatePrescription = async (doctorId, prescriptionId, updateData) => {
  console.log('Updating prescription:', prescriptionId, 'for doctor:', doctorId);
  // First check if the prescription exists and belongs to the doctor
  const existing = await findPrescriptionById(prescriptionId);
  if (!existing) {
    throw new Error('Prescription not found');
  }
  if (existing.doctor.toString() !== doctorId.toString()) {
    throw new Error('Prescription not associated with this doctor');
  }
  return await updatePrescriptionRepo(prescriptionId, updateData);
};

// Appointments
const getDoctorAppointments = async (doctorId) => {
  console.log('Getting appointments for doctor:', doctorId);
  return await findAppointmentsByDoctor(doctorId);
};

const createAppointment = async (doctorId, appointmentData) => {
  console.log('Creating appointment for doctor:', doctorId);
  return await createAppointmentRepo({
    ...appointmentData,
    doctor: doctorId,
    status: 'scheduled'
  });
};

const getAppointmentDetails = async (doctorId, appointmentId) => {
  console.log('Getting appointment details:', appointmentId, 'for doctor:', doctorId);
  const appointment = await findAppointmentById(appointmentId);
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  // Check if this appointment belongs to the doctor
  if (appointment.doctor.toString() !== doctorId.toString()) {
    throw new Error('Appointment not associated with this doctor');
  }
  return appointment;
};

const updateAppointment = async (doctorId, appointmentId, updateData) => {
  console.log('Updating appointment:', appointmentId, 'for doctor:', doctorId);
  // First check if the appointment exists and belongs to the doctor
  const existing = await findAppointmentById(appointmentId);
  if (!existing) {
    throw new Error('Appointment not found');
  }
  if (existing.doctor.toString() !== doctorId.toString()) {
    throw new Error('Appointment not associated with this doctor');
  }
  return await updateAppointmentRepo(appointmentId, updateData);
};

module.exports = {
  getDoctorProfile,
  getDoctorById,
  getAllDoctors,
  updateDoctorProfile,
  getDoctorPatients,
  getPatientDetails,
  createPrescription,
  getDoctorPrescriptions,
  getPrescriptionDetails,
  updatePrescription,
  getDoctorAppointments,
  createAppointment,
  getAppointmentDetails,
  updateAppointment
};
