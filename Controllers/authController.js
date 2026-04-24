const User = require('../Models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Helper function to send Email
const sendOTPEmail = async (email, otp, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
        from: '"TechSathi Support" <techsathi@gmail.com>',
        to: email,
        subject: 'Your Verification Code',
        html: `<h3>Hello ${name},</h3><p>Your OTP is: <b>${otp}</b></p>`
    });
};

// SIGNUP LOGIC
exports.signup = async (req, res) => {
    try {
        const { name, userName, location, mobile, email } = req.body;
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const newUser = new User({ 
            name, userName, location, mobile, email, 
            otp, otpExpires: Date.now() + 600000 
        });

        await newUser.save();
        await sendOTPEmail(email, otp, name);
        res.status(201).json({ message: "Signup successful! OTP sent to email." });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// LOGIN LOGIC
exports.loginOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: "User not found!" });

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 600000;
        await user.save();

        await sendOTPEmail(email, otp, user.name);
        res.status(200).json({ message: "Login OTP sent to email!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// VERIFY OTP LOGIC
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, otp });

        if (!user || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = undefined; 
        await user.save();

        // 🛡️ GENERATE JWT TOKEN
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET, // We must add this to your .env file
            { expiresIn: '7d' } // User stays logged in for 7 days
        );

        res.status(200).json({ 
            message: "Verification successful!", 
            token, // Send the token to the frontend
            user: { name: user.name, email: user.email, location: user.location }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};