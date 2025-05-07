const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middleware/auth');

// Protected routes (require JWT authentication)
router.post('/', auth, patientController.create);
router.get('/', auth, patientController.getAll);
router.get('/:id', auth, patientController.getById);
router.put('/:id', auth, patientController.update);
router.delete('/:id', auth, patientController.delete);

module.exports = router;