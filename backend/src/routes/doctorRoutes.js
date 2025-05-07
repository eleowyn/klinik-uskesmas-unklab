const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const fixController = require('../controllers/fixController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Middleware to check if user is a doctor
const doctorAuth = [auth, roleCheck(['doctor'])];

// Debug middleware
router.use((req, res, next) => {
  console.log('Doctor Route -', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    userId: req.user?.id,
    role: req.user?.role
  });
  next();
});

// Profile Routes
router.get('/profile', doctorAuth, doctorController.getProfile);

// Patient Routes
router.get('/patients', doctorAuth, doctorController.getPatients);
router.get('/patients/:id', doctorAuth, doctorController.getPatientDetails);

router.post('/patients/:patientId/assign', doctorAuth, doctorController.assignPatientToDoctor);

// New route to fix patient-doctor assignments
router.post('/fix-patient-assignments', doctorAuth, fixController.fixPatientDoctorAssignments);


// Prescription Routes
router.get('/prescriptions', doctorAuth, doctorController.getPrescriptions);
router.get('/prescriptions/:id', doctorAuth, doctorController.getPrescriptionDetails);
router.post('/prescriptions', doctorAuth, doctorController.createPrescription);
router.put('/prescriptions/:id', doctorAuth, doctorController.updatePrescription);
router.delete('/prescriptions/:id', doctorAuth, doctorController.deletePrescription);

// Appointment Routes
router.get('/appointments', doctorAuth, doctorController.getAppointments);
router.get('/appointments/:id', doctorAuth, doctorController.getAppointmentDetails);
router.put('/appointments/:id', doctorAuth, doctorController.updateAppointment);

// Schedule Routes
router.get('/schedule', doctorAuth, doctorController.getSchedule);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Doctor Routes Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

module.exports = router;
