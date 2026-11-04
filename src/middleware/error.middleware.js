function notFound(_req, res) {
  return res.status(404).json({ error: 'Route not found' });
}

function errorHandler(err, _req, res, _next) {
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = { notFound, errorHandler };
