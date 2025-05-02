const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get doctor profile
router.get('/profile', auth, roleCheck(['doctor']), doctorController.getProfile);

// Get doctor by ID
router.get('/:id', auth, roleCheck(['staff', 'patient']), doctorController.getDoctor);

// Get all doctors
router.get('/', auth, roleCheck(['staff', 'patient']), doctorController.getDoctors);

// Update doctor profile
router.put('/profile', auth, roleCheck(['doctor']), doctorController.updateProfile);

// Prescription routes
router.post('/prescriptions', auth, roleCheck(['doctor']), doctorController.createPrescription);
router.get('/prescriptions', auth, roleCheck(['doctor']), doctorController.getPrescriptions);
router.get('/prescriptions/:id', auth, roleCheck(['doctor']), doctorController.getPrescription);
router.put('/prescriptions/:id', auth, roleCheck(['doctor']), doctorController.updatePrescription);

module.exports = router;