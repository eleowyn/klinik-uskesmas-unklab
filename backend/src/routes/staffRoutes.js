const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Debugging line to verify imports
console.log('Imported staffController methods:', Object.keys(staffController));

// Patient Management Routes
router.get('/patients', auth, roleCheck(['staff']), staffController.getPatients);
router.get('/patients/:id', auth, roleCheck(['staff']), staffController.getPatient);
router.post('/patients', auth, roleCheck(['staff']), staffController.createPatient);
router.put('/patients/:id', auth, roleCheck(['staff']), staffController.updatePatient);
router.delete('/patients/:id', auth, roleCheck(['staff']), staffController.deletePatient);
router.get('/patients/:patientId/transactions', auth, roleCheck(['staff']), staffController.getPatientTransactionHistory);

// Transaction Routes
router.get('/transactions', auth, roleCheck(['staff']), staffController.getTransactions);
router.get('/transactions/:id', auth, roleCheck(['staff']), staffController.getTransaction);
router.post('/transactions', auth, roleCheck(['staff']), staffController.createTransaction);
router.put('/transactions/:id', auth, roleCheck(['staff']), staffController.updateTransaction);
router.delete('/transactions/:id', auth, roleCheck(['staff']), staffController.deleteTransaction);

// Appointment Management Routes
router.get('/appointments', auth, roleCheck(['staff']), staffController.fetchUpcomingAppointments);
router.get('/appointments/:id', auth, roleCheck(['staff']), staffController.getAppointment);
router.post('/appointments', auth, roleCheck(['staff']), staffController.createAppointment);
router.put('/appointments/:id', auth, roleCheck(['staff']), staffController.updateAppointment);
router.delete('/appointments/:id', auth, roleCheck(['staff']), staffController.deleteAppointment);

// Remove the doctors route if you don't have a getDoctors controller method
// router.get('/doctors', auth, roleCheck(['staff']), staffController.getDoctors);

// Staff Profile Routes
router.get('/profile', auth, roleCheck(['staff']), staffController.getProfile);
router.put('/profile', auth, roleCheck(['staff']), staffController.updateProfile);

// Staff Management Routes
router.get('/', auth, roleCheck(['staff']), staffController.getStaffMembers);
router.get('/:id', auth, roleCheck(['staff']), staffController.getStaff);

// Get all doctors
router.get('/doctors', auth, roleCheck(['staff']), staffController.getDoctors);

module.exports = router;