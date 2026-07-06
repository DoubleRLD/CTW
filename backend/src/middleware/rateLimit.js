import rateLimit from 'express-rate-limit';

// Shared handler so both limiters return the same JSON shape as the
// rest of the API (errorHandler.js) instead of express-rate-limit's
// default plain-text response.
function rateLimitHandler(req, res) {
  res.status(429).json({
    error: 'Too many attempts. Please wait a few minutes and try again.',
  });
}

// Login is the classic brute-force target: an attacker with a list of
// emails can hammer this endpoint trying passwords. Counting only
// FAILED attempts (skipSuccessfulRequests) means a legitimate user who
// mistypes their password once or twice, then logs in correctly,
// never gets blocked — only repeated failures count against the limit.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true, // adds RateLimit-* response headers
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: rateLimitHandler,
});

// Registration doesn't need brute-force protection the same way, but
// an unlimited endpoint that creates a DB row + hashes a password is
// still a cheap target for spam/automated account creation. Looser
// window, since normal usage never gets close to this.
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// General rate limit applied to all /api routes as defense in depth —
// auth has its own tighter limiters above, this just stops any single
// endpoint from being hammered in a loop (e.g. spamming POST /reviews)
// without needing a bespoke limiter on every single route.
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
