const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  userName: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 40 },
  location: { type: String, required: true, trim: true, maxlength: 200 },
  mobile: { type: String, required: true, unique: true, match: /^\\d{10}$/ },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  isVerified: { type: Boolean, default: false },
  otpHash: { type: String, select: false },
  otpExpires: { type: Date, select: false },
  otpAttempts: { type: Number, default: 0, select: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

module.exports = mongoose.model('User', UserSchema);
