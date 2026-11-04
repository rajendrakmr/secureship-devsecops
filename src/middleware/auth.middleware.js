function requireApiKey(req, res, next) {
  const expectedKey = process.env.API_KEY;
  const suppliedKey = req.get('x-api-key');

  if (!expectedKey) {
    return res.status(503).json({ error: 'API authentication is not configured' });
  }
  if (!suppliedKey || suppliedKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}

module.exports = { requireApiKey };
