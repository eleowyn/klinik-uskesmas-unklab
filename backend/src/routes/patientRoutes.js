const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get patient profile (for patient)
router.get('/profile', auth, roleCheck(['patient']), patientController.getProfile);

// Get patient by ID (for staff/doctor)
router.get('/:id', auth, roleCheck(['staff', 'doctor']), patientController.getPatient);

// Get all patients (for staff/doctor)
router.get('/', auth, roleCheck(['staff', 'doctor']), patientController.getPatients);

// Update patient profile
router.put('/profile', auth, roleCheck(['patient']), patientController.updateProfile);

module.exports = router;