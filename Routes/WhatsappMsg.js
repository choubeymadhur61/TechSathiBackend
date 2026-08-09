const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/api/tickets/create', async (req, res) => {
  try {
    const { subject, address, lat, lng, userName, userPhone } = req.body;

    // 1. Build Google Maps Link if GPS coordinates exist
    const mapsUrl = (lat && lng) 
      ? `https://maps.google.com/?q=${lat},${lng}` 
      : 'GPS Not Attached';

    // 2. Format WhatsApp Alert Message
    const whatsappMessage = 
      `🚨 *TechSathiBhopal — Ticket Alert*\n\n` +
      `👤 *User:* ${userName}\n` +
      `📞 *Phone:* ${userPhone}\n` +
      `📍 *Address:* ${address}\n` +
      `🗺️ *Google Maps:* ${mapsUrl}\n` +
      `🛠️ *Issue:* ${subject}`;

    // 3. Dispatch to CallMeBot WhatsApp Gateway
    const encodedMsg = encodeURIComponent(whatsappMessage);
    const targetPhone = "919902562230"; // Your personal number
    const apiKey = process.env.CALLMEBOT_API_KEY || "YOUR_CALLMEBOT_KEY";

    await axios.get(`https://api.callmebot.com/whatsapp.php?phone=${targetPhone}&text=${encodedMsg}&apikey=${apiKey}`);

    res.status(200).json({ success: true, message: "Ticket logged & WhatsApp notification sent." });
  } catch (err) {
    console.error("WhatsApp Integration Error:", err);
    res.status(500).json({ success: false, message: "Server error handling ticket alert." });
  }
});

module.exports = router;