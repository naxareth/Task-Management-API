const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

console.log('Setting up auth routes');

// Public routes
router.post('/register', (req, res, next) => {
  console.log('Register route hit');
  register(req, res, next);
});
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;