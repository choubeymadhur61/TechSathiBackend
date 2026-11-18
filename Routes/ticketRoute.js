const express = require('express');
const { createTicket } = require('../Controllers/ticketController');

const router = express.Router();
router.post('/create', createTicket);

module.exports = router;
