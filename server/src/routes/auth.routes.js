const express = require('express');
const router = express.Router();
const { register, login, verifyOtp, me } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.get('/me', authenticate, me);

module.exports = router;
