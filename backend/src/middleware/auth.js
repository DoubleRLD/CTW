import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler.js';

// Attaches req.user if a valid token is present; blocks the request
// with a 401 if not. Use on routes that require a logged-in user
// (writing reviews, creating a roommate profile, etc).
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Missing or invalid authorization header.'));
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // e.g. { userId, schoolId, email }
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token.'));
  }
}

// Attaches req.user if a token is present, but doesn't block the
// request if it's missing. Use on read routes where auth is optional
// (e.g. browsing dorms) but you still want to know who's asking.
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next();

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // ignore invalid token on optional routes
  }
  next();
}
