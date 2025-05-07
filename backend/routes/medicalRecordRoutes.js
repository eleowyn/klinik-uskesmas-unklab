const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const auth = require('../middleware/auth');

// Protected routes (require JWT authentication)
router.post('/', auth, medicalRecordController.create);
router.get('/', auth, medicalRecordController.getAll);
router.get('/:id', auth, medicalRecordController.getById);
router.get('/patient/:patientId', auth, medicalRecordController.getByPatientId);
router.put('/:id', auth, medicalRecordController.update);
router.delete('/:id', auth, medicalRecordController.delete);

module.exports = router;