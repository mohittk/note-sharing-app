const rateLimit = require('express-rate-limit');
const config = require('../config');

const rateLimitMiddleware = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.maxRequests,
  message: 'Too many requests, please try again later.',
});

module.exports = rateLimitMiddleware;