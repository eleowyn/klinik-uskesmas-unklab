const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Debug middleware
router.use((req, res, next) => {
  console.log('Staff Route -', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    userId: req.user?.id,
    role: req.user?.role
  });
  next();
});

// Middleware to check if user is staff
const staffAuth = [auth, roleCheck(['staff'])];

// Staff Profile Routes
router.get('/profile', staffAuth, staffController.getProfile);
router.get('/staff/:id', staffAuth, staffController.getStaff);
router.get('/staff', staffAuth, staffController.getStaffMembers);
router.put('/profile', staffAuth, staffController.updateProfile);

// Doctor Routes
router.get('/doctors', staffAuth, staffController.getDoctors);

// Patient Routes
router.get('/patients', staffAuth, staffController.getPatients);
router.post('/patients', staffAuth, staffController.createPatient);
router.get('/patients/:id', staffAuth, staffController.getPatient);
router.put('/patients/:id', staffAuth, staffController.updatePatient);
router.delete('/patients/:id', staffAuth, staffController.deletePatient);

// Transaction Routes
router.post('/transactions', staffAuth, staffController.createTransaction);
router.get('/transactions', staffAuth, staffController.getTransactions);
router.get('/transactions/:id', staffAuth, staffController.getTransaction);
router.put('/transactions/:id', staffAuth, staffController.updateTransaction);
router.delete('/transactions/:id', staffAuth, staffController.deleteTransaction);
router.get('/patients/:patientId/transactions', staffAuth, staffController.getPatientTransactionHistory);

// Appointment Routes
router.get('/appointments', staffAuth, staffController.fetchUpcomingAppointments);
router.post('/appointments', staffAuth, staffController.createAppointment);
router.get('/appointments/:id', staffAuth, staffController.getAppointment);
router.put('/appointments/:id', staffAuth, staffController.updateAppointment);
router.delete('/appointments/:id', staffAuth, staffController.deleteAppointment);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Staff Routes Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

module.exports = router;
