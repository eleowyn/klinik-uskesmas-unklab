const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get clinic info (public)
router.get('/', clinicController.getInfo);

// Update clinic info (staff only)
router.put('/', auth, roleCheck(['staff']), clinicController.updateInfo);

module.exports = router;