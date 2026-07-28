import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler.js';

// Verifies the Bearer token issued by auth.controller.js's signToken()
// and attaches its payload ({ userId, schoolId, email }) to req.user so
// every downstream controller can read req.user.userId / req.user.schoolId.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token.'));
  }
}
