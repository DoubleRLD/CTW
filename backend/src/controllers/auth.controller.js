import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as UsersModel from '../models/users.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  parseOrThrow,
} from '../middleware/validate.js';
import { sendVerificationEmail } from '../services/emailService.js';

const SALT_ROUNDS = 12;
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function signToken(user) {
  return jwt.sign(
    { userId: user.user_id, schoolId: user.school_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Strips sensitive/internal fields before sending a user object to
// the client — password_hash obviously, but also the verification
// token hash, which should never leave the server.
function toPublicUser(user) {
  const { password_hash, verification_token_hash, verification_token_expires, ...publicUser } = user;
  return publicUser;
}

// Generates a random token for the email link, plus the SHA-256 hash
// of it that actually gets stored — see schema.sql for why hashed,
// not raw, tokens live in the database.
function generateVerificationToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  return { rawToken, tokenHash, expiresAt };
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = parseOrThrow(registerSchema, req.body, ApiError);

  const existing = await UsersModel.findUserByEmail(email);
  if (existing) throw new ApiError(409, 'An account with this email already exists.');

  // School is derived from the email domain (e.g. "student@gsu.edu" -> "gsu.edu")
  // rather than typed in freeform — this is what School_Domains is for, and it
  // keeps students from accidentally (or deliberately) registering under the
  // wrong school.
  const domain = email.split('@')[1];
  const school = await UsersModel.findSchoolByDomain(domain);
  if (!school) {
    throw new ApiError(400, 'This email domain is not associated with a registered school.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const { rawToken, tokenHash, expiresAt } = generateVerificationToken();

  const user = await UsersModel.createUser({
    schoolId: school.school_id,
    name,
    email,
    passwordHash,
    verificationTokenHash: tokenHash,
    verificationTokenExpires: expiresAt,
  });

  const emailResult = await sendVerificationEmail(user, rawToken);

  // No JWT is issued here — the account exists but can't log in until
  // the email link is clicked (see login() below). Registering no
  // longer implies "logged in," it implies "pending proof you own
  // this inbox" — that's the actual security improvement.
  res.status(201).json({
    message: 'Account created. Check your email to verify your account before logging in.',
    user: toPublicUser(user),
    // Only surface the raw link in dev/console mode — in real SMTP
    // mode this would be a serious leak (it would let anyone verify
    // any account without ever receiving the email).
    ...(emailResult.mode === 'console' ? { devVerificationLink: emailResult.link } : {}),
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = parseOrThrow(loginSchema, req.body, ApiError);

  const user = await UsersModel.findUserByEmail(email);
  // Deliberately vague error on both "no such user" and "wrong password" —
  // distinguishing them lets an attacker enumerate which emails have accounts.
  if (!user) throw new ApiError(401, 'Invalid email or password.');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new ApiError(401, 'Invalid email or password.');

  if (!user.email_verified) {
    throw new ApiError(403, 'Please verify your email before logging in. Check your inbox for the verification link.');
  }

  const token = signToken(user);
  res.json({ token, user: toPublicUser(user) });
});

// POST /api/auth/verify-email
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = parseOrThrow(verifyEmailSchema, req.body, ApiError);

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await UsersModel.findUserByVerificationTokenHash(tokenHash);

  if (!user) throw new ApiError(400, 'Invalid verification link.');

  if (new Date(user.verification_token_expires) < new Date()) {
    throw new ApiError(400, 'This verification link has expired. Request a new one.');
  }

  const verifiedUser = await UsersModel.markEmailVerified(user.user_id);

  // Log the user in immediately on successful verification — smoother
  // than sending them back to a login screen right after they just
  // proved who they are.
  const jwtToken = signToken(verifiedUser);
  res.json({ token: jwtToken, user: toPublicUser(verifiedUser) });
});

// POST /api/auth/resend-verification
export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = parseOrThrow(resendVerificationSchema, req.body, ApiError);

  const user = await UsersModel.findUserByEmail(email);

  // Same email-enumeration defense as login: respond identically
  // whether or not the account exists, or is already verified.
  const genericResponse = {
    message: 'If an account exists for this email and needs verification, a new link has been sent.',
  };

  if (!user || user.email_verified) {
    return res.json(genericResponse);
  }

  const { rawToken, tokenHash, expiresAt } = generateVerificationToken();
  await UsersModel.setVerificationToken(user.user_id, tokenHash, expiresAt);
  const emailResult = await sendVerificationEmail(user, rawToken);

  res.json({
    ...genericResponse,
    ...(emailResult.mode === 'console' ? { devVerificationLink: emailResult.link } : {}),
  });
});

// GET /api/auth/me — used to rehydrate user state on app load from a stored token
export const me = asyncHandler(async (req, res) => {
  const user = await UsersModel.findUserById(req.user.userId);
  if (!user) throw new ApiError(404, 'User not found.');
  res.json({ user });
});
