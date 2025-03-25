const express = require('express');
const { getDashboard } = require('../controllers/adminController');
const { authenticate, isStaff } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', authenticate, isStaff, getDashboard);

module.exports = router;