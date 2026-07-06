import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UsersModel from '../models/users.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { registerSchema, loginSchema, parseOrThrow } from '../middleware/validate.js';

const SALT_ROUNDS = 12;

function signToken(user) {
  return jwt.sign(
    { userId: user.user_id, schoolId: user.school_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Strips password_hash before sending a user object to the client.
function toPublicUser(user) {
  const { password_hash, ...publicUser } = user;
  return publicUser;
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = parseOrThrow(registerSchema, req.body, ApiError);

  const existing = await UsersModel.findUserByEmail(email);
  if (existing) throw new ApiError(409, 'An account with this email already exists.');

  // School is derived from the email domain (e.g. "student@gsu.edu" -> "gsu.edu")
  // rather than typed in freeform — this is what Schools.domain is for, and it
  // keeps students from accidentally (or deliberately) registering under the
  // wrong school.
  const domain = email.split('@')[1];
  const school = await UsersModel.findSchoolByDomain(domain);
  if (!school) {
    throw new ApiError(400, 'This email domain is not associated with a registered school.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UsersModel.createUser({
    schoolId: school.school_id,
    name,
    email,
    passwordHash,
  });

  const token = signToken(user);
  res.status(201).json({ token, user: toPublicUser(user) });
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

  const token = signToken(user);
  res.json({ token, user: toPublicUser(user) });
});

// GET /api/auth/me — used to rehydrate user state on app load from a stored token
export const me = asyncHandler(async (req, res) => {
  const user = await UsersModel.findUserById(req.user.userId);
  if (!user) throw new ApiError(404, 'User not found.');
  res.json({ user });
});
