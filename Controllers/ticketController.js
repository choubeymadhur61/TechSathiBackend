const Ticket = require('../Models/Ticket');

exports.createTicket = async (req, res) => {
  try {
    const { subject, address, lat, lng } = req.body || {};
    if (typeof subject !== 'string' || !subject.trim() ||
        typeof address !== 'string' || !address.trim()) {
      return res.status(400).json({ error: 'Issue and service address are required.' });
    }
    const hasLat = lat !== null && lat !== undefined && lat !== '';
    const hasLng = lng !== null && lng !== undefined && lng !== '';
    if (hasLat !== hasLng) return res.status(400).json({ error: 'Both GPS coordinates must be provided together.' });
    const latitude = hasLat ? Number(lat) : undefined;
    const longitude = hasLng ? Number(lng) : undefined;
    if (hasLat && (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
        latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)) {
      return res.status(400).json({ error: 'Invalid GPS coordinates.' });
    }
    const ticket = await Ticket.create({
      subject: subject.trim().slice(0, 300),
      address: address.trim().slice(0, 500),
      requesterName: req.user.name,
      requesterPhone: req.user.mobile,
      latitude,
      longitude
    });
    return res.status(201).json({
      message: 'Support request received. Our team will contact you.',
      ticket: { id: ticket._id, status: ticket.status, createdAt: ticket.createdAt }
    });
  } catch (err) {
    console.error('Ticket creation failed:', err.message);
    return res.status(500).json({ error: 'Unable to create the support request. Please try again later.' });
  }
};
