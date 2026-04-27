const express = require('express');
const router = express.Router();
const Service = require('../Models/Services'); // Jo model aapne abhi banaya

// Sabhi services ko fetch karne ke liye API
router.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch services" });
    }
});

module.exports = router;