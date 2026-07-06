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

// schoolId is resolved by the controller from the user's email domain
// before this is called — see auth.controller.js.
export async function createUser({ schoolId, name, email, passwordHash }) {
  const [result] = await pool.query(
    'INSERT INTO Users (school_id, name, email, password_hash) VALUES (?, ?, ?, ?)',
    [schoolId, name, email, passwordHash]
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
