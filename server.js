const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log("Email User:", process.env.EMAIL_USER); // Terminal mein check karein

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/techsathi")
    .then(() => console.log("✅ TechSathi MongoDB Connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));

// Routes - Ensure the filename matches your folder!
// If your file is named 'authRoute.js', use that name here:
const authRoutes = require('./Routes/authRoute'); 

app.use('/api', authRoutes);

// Service Routes
// const serviceRoutes = require('./Routes/ServiceRoute');
const servicesroutes = require ('./Routes/ServiceRoute');
app.use('/api', servicesroutes);

// Use a fallback port if .env is missing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

























// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const User = require('./Models/User');
// const sendWelcomeEmail = require('./utils/sendEmail');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect("mongodb://localhost:27017/techsathi", )
//     .then(() => console.log("TechSathi MongoDB Connected"))
//     .catch(err => console.error(err));

// // Signup Route

// const authRoutes = require('./routes/authRoutes');

// app.use('/api', authRoutes); // This replaces your old routes

// app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

















// // app.post('/api/signup', async (req, res) => {
// //     try {
// //         const { name, userName, location, mobile, email } = req.body;

// //         const existingUser = await User.findOne({ $or: [{ mobile }, { email }, { userName }] });
// //         if (existingUser) {
// //             return res.status(400).json({ error: "User already exists!" });
// //         }

// //         // 1. Generate OTP first
// //         const otp = Math.floor(1000 + Math.random() * 9000).toString();
// //         const otpExpires = Date.now() + 600000; // 10 mins

// //         // 2. Create user with OTP data
// //         const newUser = new User({ 
// //             name, 
// //             userName, 
// //             location, 
// //             mobile, 
// //             email, 
// //             otp, 
// //             otpExpires 
// //         });

// //         await newUser.save();
        
// //         // 3. Log OTP so you can see it in VS Code Terminal
// //         console.log(`✅ Verification OTP for ${name}: ${otp}`);

// //         // 4. Send response LAST
// //         res.status(201).json({ message: "Signup Successful! Enter OTP from terminal." });

// //     } catch (error) {
// //         console.error("❌ Signup Error:", error.message);
// //         res.status(500).json({ error: "Internal Server Error" });
// //     }
// // });
// // app.post('/api/signup', async (req, res) => {
// //     try {
// //         console.log("1. Received Data:", req.body); // Log to terminal

// //         const { name, userName, location, mobile, email } = req.body;

// //         // Check for existing users to prevent Duplicate Key crash
// //         const existingUser = await User.findOne({ $or: [{ mobile }, { email }, { userName }] });
// //         if (existingUser) {
// //             console.log("2. Conflict Found");
// //             return res.status(400).json({ error: "Username, Email, or Mobile already exists in Bhopal database." });
// //         }

// //         const newUser = new User({ name, userName, location, mobile, email });
// //         await newUser.save();
// //         console.log("3. User Saved Successfully");

// //         // Use a separate try-catch for email so it doesn't crash the signup
// //         try {
// //             // await sendWelcomeEmail(email, name); 
// //             console.log("4. Welcome Email logic triggered");
// //         } catch (emailErr) {
// //             console.error("Email Error (Signup still succeeded):", emailErr.message);
// //         }

// //         res.status(201).json({ message: "Signup Successful! Account created." });

// //     } catch (error) {
// //         console.error("❌ BACKEND CRASH ERROR:", error.message); // Look for this in terminal!
// //         res.status(500).json({ error: "Internal Server Error", details: error.message });
// //     }
// //     const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generates 4 digits
// // newUser.otp = otp;
// // newUser.otpExpires = Date.now() + 600000; // Code valid for 10 minutes

// // await newUser.save();

// // // Log it to terminal for now (since we haven't integrated an SMS API yet)
// // console.log(`Verification OTP for ${name}: ${otp}`);

// // });
