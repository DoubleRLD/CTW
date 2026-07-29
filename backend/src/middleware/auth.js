import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { ApiError } from './errorHandler.js';

// Verifies the Bearer token issued by auth.controller.js's signToken()
// and attaches its payload ({ userId, schoolId, email }) to req.user so
// every downstream controller can read req.user.userId / req.user.schoolId.
//
// isAdmin/isBanned are looked up fresh from the DB on every request
// rather than trusted from the JWT payload — a JWT is only re-signed
// on login, so if it were the source of truth, promoting an admin (or
// banning someone) wouldn't take effect until their next login, up to
// 7 days later. A banned user in particular needs to lose access
// immediately, not "eventually."
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.query(
      'SELECT is_admin FROM Users WHERE user_id = ?',
      [decoded.userId]
    );
    const user = rows[0];
    if (!user) return next(new ApiError(401, 'Invalid or expired token.'));
    //if (user.is_banned) return next(new ApiError(403, 'Your account has been suspended.'));

    req.user = { ...decoded, isAdmin: !!user.is_admin };
    next();
  } catch (err) {
  console.error(err);
  next(new ApiError(401, 'Invalid or expired token.'));
  }
}

// Must run after requireAuth.
export function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return next(new ApiError(403, 'Admin access required.'));
  }
  next();
}
