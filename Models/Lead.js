const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  mobile: { type: String, required: true, match: /^\d{10}$/ },
  location: { type: String, required: true, trim: true, maxlength: 200 },
  requirement: { type: String, required: true, trim: true, maxlength: 300 },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted', 'closed'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
