const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    userName: { type: String, required: true, unique: true, lowercase: true, trim: true },
    location: { type: String, required: true },
    mobile: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^\d{10}$/, 'Please fill a valid 10-digit mobile number'] 
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);











// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     name: { 
//         type: String, 
//         required: true,
//         trim: true // Removes accidental spaces
//     },
//     userName: { 
//         type: String, 
//         required: true, 
//         unique: true,
//         lowercase: true, // Saves as 'madhur' even if user types 'Madhur'
//         trim: true 
//     },
//     location: { 
//         type: String, 
//         required: true 
//     },
//     mobile: { 
//         type: String, 
//         required: true, 
//         unique: true,
//         match: [/^\d{10}$/, 'Please fill a valid 10-digit mobile number'] 
//     },
//     email: { 
//         type: String, 
//         required: true, 
//         unique: true,
//         lowercase: true,
//         trim: true
//     },
//     isVerified: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now },

//     // Add these to your UserSchema in User.js
//     otp: { type: String },
// otpExpires: { type: Date },
// isVerified: { type: Boolean, default: false } //
// });

// module.exports = mongoose.model('User', UserSchema);


// // const mongoose = require('mongoose');

// // const UserSchema = new mongoose.Schema({
// //     name: { type: String, required: true },
// //     userName: { type: String, required: true, unique: true },
// //     location: { type: String, required: true },
// //     mobile: { 
// //     type: String, 
// //     required: true, 
// //     unique: true,
// //     match: [/^\d{10}$/, 'Please fill a valid 10-digit mobile number'] 
// // },
// //     email: { type: String, required: true, unique: true },
// //     isVerified: { type: Boolean, default: false }, // For OTP status
// //     createdAt: { type: Date, default: Date.now }
// // });

// // module.exports = mongoose.model('User', UserSchema);