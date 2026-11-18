const express = require('express');
const rateLimit = require('express-rate-limit');
const { signup, loginOTP, verifyOTP } = require('../Controllers/authController');

const router = express.Router();
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many verification requests. Please try again later.' }
});
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many verification attempts. Please try again later.' }
});

router.post('/signup', otpRequestLimiter, signup);
router.post('/login-otp', otpRequestLimiter, loginOTP);
router.post('/verify-otp', otpVerifyLimiter, verifyOTP);

module.exports = router;
