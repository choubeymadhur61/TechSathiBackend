const express = require('express');
const createRateLimiter = require('../Middleware/rateLimit');
const { signup, loginOTP, verifyOTP } = require('../Controllers/authController');

const router = express.Router();
const otpRequestLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, max: 5,
  message: 'Too many verification requests. Please try again later.'
});
const otpVerifyLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, max: 10,
  message: 'Too many verification attempts. Please try again later.'
});

router.post('/signup', otpRequestLimiter, signup);
router.post('/login-otp', otpRequestLimiter, loginOTP);
router.post('/verify-otp', otpVerifyLimiter, verifyOTP);

module.exports = router;
