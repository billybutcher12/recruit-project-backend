const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Route để lấy thông tin user hiện tại
router.get('/me', authenticate, (req, res) => {
  res.json({ id: req.user.id, role: req.user.role });
});

module.exports = router;