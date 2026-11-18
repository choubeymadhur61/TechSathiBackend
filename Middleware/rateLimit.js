const buckets = new Map();

module.exports = ({ windowMs = 15 * 60 * 1000, max = 5, message = 'Too many requests. Please try again later.' } = {}) => {
  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip || req.socket.remoteAddress || 'unknown'}:${req.baseUrl}${req.path}`;
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - bucket.count)));
    res.setHeader('RateLimit-Reset', String(Math.ceil((bucket.resetAt - now) / 1000)));
    if (bucket.count > max) return res.status(429).json({ error: message });
    if (buckets.size > 1000) {
      for (const [bucketKey, value] of buckets) {
        if (value.resetAt <= now) buckets.delete(bucketKey);
      }
    }
    return next();
  };
};
