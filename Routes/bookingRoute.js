const protect = require('../Middleware/authMiddleware');
const { createBooking } = require('../Controllers/bookingController');

router.post('/book-service', protect, createBooking);