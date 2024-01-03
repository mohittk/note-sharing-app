module.exports = {
    secretKey: 'your-secret-key',
    expiresIn: '1h',
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // max 100 requests per window
  };