const Booking = require('../Models/Booking');

exports.createBooking = async (req, res) => {
    try {
        const { deviceType, issueDescription, preferredDate } = req.body;
        
        // We get the userId from the JWT token (we'll set this up next)
        const newBooking = new Booking({
            userId: req.user.userId, 
            deviceType,
            issueDescription,
            preferredDate
        });

        await newBooking.save();
        res.status(201).json({ message: "Service booked successfully! We will contact you shortly." });
    } catch (err) {
        res.status(500).json({ error: "Failed to create booking." });
    }
};