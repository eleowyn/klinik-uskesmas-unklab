const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const auth = require('../middleware/auth');

// Protected routes (require JWT authentication)
router.post('/login', staffController.login);
// router.post('/register', staffController.register);
router.get('/', auth, staffController.getAll);
router.get('/:id', auth, staffController.getById);
router.put('/:id', auth, staffController.update);
router.delete('/:id', auth, staffController.delete);

module.exports = router;