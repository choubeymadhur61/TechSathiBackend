const express = require('express');
const createRateLimiter = require('../Middleware/rateLimit');
const { createTicket } = require('../Controllers/ticketController');
const requireAuth = require('../Middleware/authMiddleware');

const router = express.Router();
const createTicketLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, max: 10,
  message: 'Too many support requests. Please try again later.'
});
router.post('/create', requireAuth, createTicketLimiter, createTicket);

module.exports = router;
