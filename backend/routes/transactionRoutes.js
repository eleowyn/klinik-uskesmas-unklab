const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// Protected routes (require JWT authentication)
router.post('/', auth, transactionController.create);
router.get('/', auth, transactionController.getAll);
router.get('/:id', auth, transactionController.getById);
router.get('/patient/:patientId', auth, transactionController.getByPatientId);
router.put('/:id', auth, transactionController.update);
router.delete('/:id', auth, transactionController.delete);

module.exports = router;