const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceType: { type: String, enum: ['Laptop', 'Desktop', 'Networking', 'Other'], required: true },
    issueDescription: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    status: { type: String, default: 'Pending' }, // Pending, Assigned, Completed
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);