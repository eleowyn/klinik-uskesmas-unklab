const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const auth = require('../middleware/auth');

// Protected routes (require JWT authentication)
router.post('/', auth, prescriptionController.create);
router.get('/', auth, prescriptionController.getAll);
router.get('/:id', auth, prescriptionController.getById);
router.get('/patient/:patientId', auth, prescriptionController.getByPatientId);
router.put('/:id', auth, prescriptionController.update);
router.delete('/:id', auth, prescriptionController.delete);

module.exports = router;