const express = require('express');
const rateLimit = require('express-rate-limit');
const { createTicket } = require('../Controllers/ticketController');
const requireAuth = require('../Middleware/authMiddleware');

const router = express.Router();
const createTicketLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many support requests. Please try again later.' }
});
router.post('/create', requireAuth, createTicketLimiter, createTicket);

module.exports = router;
