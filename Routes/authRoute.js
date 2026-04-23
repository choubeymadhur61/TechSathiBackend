const express = require('express');
const router = express.Router();
const { signup, loginOTP, verifyOTP } = require('../Controllers/authController');

// Signup Route
router.post('/signup', signup);

// Login Route (Request OTP)
router.post('/login-otp', loginOTP);

// Verification Route (Common for both)
router.post('/verify-otp', verifyOTP);

module.exports = router;