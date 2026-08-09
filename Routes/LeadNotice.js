// routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const axios = require('axios');

router.post('/api/leads/create', async (req, res) => {
  try {
    const { name, phone, service, area } = req.body;

    // 1. Save in MongoDB Leads Collection
    const newLead = await Lead.create({ name, phone, service, area });

    // 2. WhatsApp Alert Message Format
    const whatsappMsg = 
      `🎯 *New Launch Lead Registered!*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `🛠️ *Service Needed:* ${service}\n` +
      `📍 *Area:* ${area}\n` +
      `🎟️ *Coupon:* 20% Early Access Reserved`;

    // 3. Dispatch to WhatsApp
    const encodedMsg = encodeURIComponent(whatsappMsg);
    const targetPhone = process.env.CALLMEBOT_PHONE_NUMBER;
    const apiKey = process.env.CALLMEBOT_API_KEY;

    await axios.get(`https://api.callmebot.com/whatsapp.php?phone=${targetPhone}&text=${encodedMsg}&apikey=${apiKey}`);

    res.status(201).json({ success: true, lead: newLead });
  } catch (err) {
    console.error("Lead Saving Error:", err);
    res.status(500).json({ success: false, message: "Server error saving lead" });
  }
});

module.exports = router;