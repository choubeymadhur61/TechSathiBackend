const express = require('express');
const createRateLimiter = require('../Middleware/rateLimit');
const { createLead } = require('../Controllers/leadController');

const router = express.Router();
router.post('/', createRateLimiter({
  windowMs: 15 * 60 * 1000, max: 5,
  message: 'Too many enquiry submissions. Please try again later.'
}), createLead);

module.exports = router;
