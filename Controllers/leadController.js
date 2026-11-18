const Lead = require('../Models/Lead');

exports.createLead = async (req, res) => {
  try {
    const { name, mobile, location, requirement } = req.body || {};
    if (typeof name !== 'string' || !name.trim() ||
        !/^\d{10}$/.test(String(mobile || '')) ||
        typeof location !== 'string' || !location.trim() ||
        typeof requirement !== 'string' || !requirement.trim()) {
      return res.status(400).json({ error: 'Please provide your name, valid 10-digit mobile, location and requirement.' });
    }
    const lead = await Lead.create({
      name: name.trim().slice(0, 100),
      mobile: String(mobile),
      location: location.trim().slice(0, 200),
      requirement: requirement.trim().slice(0, 300)
    });
    return res.status(201).json({
      message: 'Your request has been received. Our team will contact you.',
      reference: lead._id
    });
  } catch (err) {
    console.error('Lead creation failed:', err.message);
    return res.status(500).json({ error: 'Unable to submit your request. Please try again later.' });
  }
};
