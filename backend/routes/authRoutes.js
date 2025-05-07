const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

router.post('/login', staffController.login);
router.post('/register', staffController.register);

module.exports = router;