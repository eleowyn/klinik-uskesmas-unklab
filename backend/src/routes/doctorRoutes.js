const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Profile routes - these should come first
router.get('/profile', auth, roleCheck(['doctor']), getProfile);
router.put('/profile', auth, roleCheck(['doctor']), updateProfile);

// Patient routes
router.get('/patients', auth, roleCheck(['doctor']), getDoctorPatients);
router.get('/patients/:id', auth, roleCheck(['doctor']), getPatientDetails);

// Prescription routes
router.get('/prescriptions', auth, roleCheck(['doctor']), getPrescriptions);
router.post('/prescriptions', auth, roleCheck(['doctor']), createPrescription);
router.get('/prescriptions/:id', auth, roleCheck(['doctor']), getPrescription);
router.put('/prescriptions/:id', auth, roleCheck(['doctor']), updatePrescription);

// Appointment routes
router.get('/appointments', auth, roleCheck(['doctor']), getDoctorAppointments);
router.post('/appointments', auth, roleCheck(['doctor']), createAppointment);
router.get('/appointments/:id', auth, roleCheck(['doctor']), getAppointmentDetails);
router.put('/appointments/:id', auth, roleCheck(['doctor']), updateAppointment);

// General doctor routes - these should come last to avoid catching other routes
router.get('/', auth, roleCheck(['staff', 'patient']), getDoctors);
router.get('/:id', auth, roleCheck(['staff', 'patient']), getDoctor);

module.exports = router;
