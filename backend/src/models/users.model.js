import { pool } from '../config/db.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function findUserById(userId) {
  const [rows] = await pool.query(
    'SELECT user_id, school_id, name, email, email_verified, created_at FROM Users WHERE user_id = ?',
    [userId]
  );
  return rows[0] || null;
}

// schoolId and the verification token are resolved by the controller
// before this is called — see auth.controller.js.
export async function createUser({ schoolId, name, email, passwordHash, verificationTokenHash, verificationTokenExpires }) {
  const [result] = await pool.query(
    `INSERT INTO Users
       (school_id, name, email, password_hash, verification_token_hash, verification_token_expires)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [schoolId, name, email, passwordHash, verificationTokenHash, verificationTokenExpires]
  );
  return findUserById(result.insertId);
}

// A school can now have multiple valid domains (see School_Domains in
// schema.sql), so this joins rather than querying Schools directly.
export async function findSchoolByDomain(domain) {
  const [rows] = await pool.query(
    `SELECT s.* FROM Schools s
     JOIN School_Domains sd ON sd.school_id = s.school_id
     WHERE sd.domain = ?`,
    [domain]
  );
  return rows[0] || null;
}

// Looks up by the token's hash, never the raw token — the raw value
// only ever exists in the email link and the request that hits this
// endpoint, never at rest in the database.
export async function findUserByVerificationTokenHash(tokenHash) {
  const [rows] = await pool.query(
    'SELECT * FROM Users WHERE verification_token_hash = ?',
    [tokenHash]
  );
  return rows[0] || null;
}

export async function markEmailVerified(userId) {
  await pool.query(
    `UPDATE Users
     SET email_verified = TRUE, verification_token_hash = NULL, verification_token_expires = NULL
     WHERE user_id = ?`,
    [userId]
  );
  return findUserById(userId);
}

export async function setVerificationToken(userId, tokenHash, expiresAt) {
  await pool.query(
    'UPDATE Users SET verification_token_hash = ?, verification_token_expires = ? WHERE user_id = ?',
    [tokenHash, expiresAt, userId]
  );
}
