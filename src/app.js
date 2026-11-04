const express = require('express');
const helmet = require('helmet');
const userRoutes = require('./routes/user.routes');
const healthRoutes = require('./routes/health.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
