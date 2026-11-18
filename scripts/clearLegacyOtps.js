require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../Models/User');

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGO_URI (or MONGODB_URI) is required.');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(uri);
    const result = await User.collection.updateMany({}, { $unset: { otp: '' } });
    console.log(`Legacy plaintext OTP fields cleared from ${result.modifiedCount} user record(s).`);
  } catch (error) {
    console.error('Legacy OTP cleanup failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
