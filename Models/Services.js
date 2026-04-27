const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "CCTV Installation"
    category: { type: String, required: true }, // e.g., "HARDWARE"
    description: { type: String, required: true },
    price: { type: Number, required: true }, // e.g., 999
    icon: { type: String } // Icon name from lucide-react or react-icons
});

module.exports = mongoose.model('Service', serviceSchema);