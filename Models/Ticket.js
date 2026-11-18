const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true, maxlength: 300 },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  requesterName: { type: String, trim: true, maxlength: 100 },
  requesterPhone: { type: String, required: true, match: /^\d{10}$/ },
  latitude: { type: Number, min: -90, max: 90 },
  longitude: { type: Number, min: -180, max: 180 },
  status: { type: String, enum: ['new', 'assigned', 'in_progress', 'resolved', 'cancelled'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
