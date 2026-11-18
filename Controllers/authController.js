const User = require('../Models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const hashOTP = (otp) => crypto.createHmac('sha256', process.env.OTP_PEPPER).update(otp).digest('hex');
const safeEqual = (a, b) => {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const sendOTPEmail = async (email, otp, name) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) throw new Error('Email service is not configured');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({
    from: `"TechSathiBhopal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your TechSathiBhopal verification code',
    html: `<p>Hello ${escapeHtml(name || 'there')},</p><p>Your verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p><p>If you did not request this code, ignore this email.</p>`
  });
};

const issueOTP = async (user) => {
  const otp = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
  user.otpHash = hashOTP(otp);
  user.otpExpires = new Date(Date.now() + OTP_TTL_MS);
  user.otpAttempts = 0;
  await user.save();
  await sendOTPEmail(user.email, otp, user.name);
};

exports.signup = async (req, res) => {
  let newUser;
  try {
    const { name, userName, location, mobile } = req.body || {};
    const email = normalizeEmail(req.body?.email);
    if (typeof name !== 'string' || !name.trim() ||
        typeof userName !== 'string' || !userName.trim() ||
        typeof location !== 'string' || !location.trim() ||
        !/^\d{10}$/.test(String(mobile || '')) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide valid name, username, location, 10-digit mobile and email.' });
    }
    const existing = await User.findOne({ $or: [{ email }, { mobile: String(mobile) }, { userName: userName.trim().toLowerCase() }] });
    if (existing?.isVerified) return res.status(409).json({ error: 'An account with these details already exists.' });
    if (existing && !existing.isVerified) {
      const samePendingSignup = existing.email === email &&
        existing.mobile === String(mobile) &&
        existing.userName === userName.trim().toLowerCase();
      if (!samePendingSignup) return res.status(409).json({ error: 'An account with these details already exists.' });
      await issueOTP(existing);
      return res.status(200).json({ message: 'A new verification code has been sent for your pending signup.' });
    }
    newUser = new User({
      name: name.trim(), userName: userName.trim().toLowerCase(),
      location: location.trim(), mobile: String(mobile), email, isVerified: false
    });
    await issueOTP(newUser);
    return res.status(201).json({ message: 'Signup received. Check your email for the 6-digit verification code.' });
  } catch (err) {
    if (newUser?._id) await User.deleteOne({ _id: newUser._id, isVerified: false }).catch(() => {});
    if (err.code === 11000) return res.status(409).json({ error: 'An account with these details already exists.' });
    console.error('Signup failed:', err.message);
    return res.status(500).json({ error: 'Unable to complete signup. Please try again later.' });
  }
};

exports.loginOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please provide a valid email address.' });
    const user = await User.findOne({ email, isVerified: true });
    if (user) await issueOTP(user);
    return res.status(200).json({ message: 'If a verified account exists, a verification code has been sent.' });
  } catch (err) {
    console.error('Login OTP request failed:', err.message);
    return res.status(500).json({ error: 'Unable to process the request. Please try again later.' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const otp = String(req.body?.otp || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }
    const user = await User.findOne({ email }).select('+otpHash +otpExpires +otpAttempts');
    if (!user || !user.otpHash || !user.otpExpires ||
        user.otpExpires.getTime() <= Date.now() || user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }
    if (!safeEqual(user.otpHash, hashOTP(otp))) {
      user.otpAttempts += 1;
      if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
        user.otpHash = undefined;
        user.otpExpires = undefined;
      }
      await user.save();
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      console.error('JWT_SECRET must be configured with at least 32 characters.');
      return res.status(503).json({ error: 'Authentication is temporarily unavailable.' });
    }
    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save();
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h', issuer: 'techsathibhopal' }
    );
    return res.status(200).json({
      message: 'Verification successful.',
      token,
      user: { name: user.name, email: user.email, location: user.location, mobile: user.mobile }
    });
  } catch (err) {
    console.error('OTP verification failed:', err.message);
    return res.status(500).json({ error: 'Unable to verify the code. Please try again later.' });
  }
};
