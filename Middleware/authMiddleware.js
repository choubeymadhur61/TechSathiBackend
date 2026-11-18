const jwt = require('jsonwebtoken');
const User = require('../Models/User');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Authentication required.' });
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      return res.status(503).json({ error: 'Authentication is temporarily unavailable.' });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'techsathibhopal' });
    const user = await User.findById(payload.userId).select('name email mobile location isVerified');
    if (!user || !user.isVerified) return res.status(401).json({ error: 'Please sign in again.' });
    req.user = user;
    return next();
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }
};
