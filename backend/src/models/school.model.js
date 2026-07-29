import { pool } from '../config/db.js';

// Domains are aggregated with GROUP_CONCAT so admins can see (and the
// registration flow implicitly relies on) every valid student email
// domain per school in one row, without a separate call per school.
export async function findAllSchools() {
  const [rows] = await pool.query(
    `SELECT
       s.school_id, s.name, s.created_at,
       GROUP_CONCAT(sd.domain ORDER BY sd.domain SEPARATOR ', ') AS domains,
       COUNT(DISTINCT u.user_id) AS user_count
     FROM Schools s
     LEFT JOIN School_Domains sd ON sd.school_id = s.school_id
     LEFT JOIN users u ON u.school_id = s.school_id
     GROUP BY s.school_id
     ORDER BY s.name`
  );
  return rows;
}

export async function findSchoolById(schoolId) {
  const [rows] = await pool.query('SELECT * FROM Schools WHERE school_id = ?', [schoolId]);
  return rows[0] || null;
}

// Creates a school and, optionally, its initial set of valid student
// email domains in one transaction — a school with zero domains can't
// have anyone register under it, so letting an admin set this up in
// one step avoids a school existing in a half-configured state.
export async function createSchool({ name, domains = [] }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query('INSERT INTO Schools (name) VALUES (?)', [name]);
    const schoolId = result.insertId;

    if (domains.length) {
      const values = domains.map((domain) => [schoolId, domain]);
      await conn.query('INSERT INTO School_Domains (school_id, domain) VALUES ?', [values]);
    }

    await conn.commit();
    return findSchoolById(schoolId);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function updateSchoolName(schoolId, name) {
  await pool.query('UPDATE Schools SET name = ? WHERE school_id = ?', [name, schoolId]);
  return findSchoolById(schoolId);
}

// Schools.school_id cascades to Users/Dorms/Listing_School/School_Domains
// on delete (see schema.sql) — a school with existing users or dorms
// would silently wipe them out. Counting first and refusing lets the
// admin see the numbers instead of guessing.
export async function getDeletionImpact(schoolId) {
  const [[userCount]] = await pool.query(
    'SELECT COUNT(*) AS count FROM Users WHERE school_id = ?',
    [schoolId]
  );
  const [[dormCount]] = await pool.query(
    'SELECT COUNT(*) AS count FROM Dorms WHERE school_id = ?',
    [schoolId]
  );
  return { userCount: userCount.count, dormCount: dormCount.count };
}

export async function deleteSchool(schoolId) {
  const [result] = await pool.query('DELETE FROM Schools WHERE school_id = ?', [schoolId]);
  return result.affectedRows > 0;
}

export async function addDomain(schoolId, domain) {
  await pool.query('INSERT INTO School_Domains (school_id, domain) VALUES (?, ?)', [schoolId, domain]);
  return findAllSchools();
}

export async function removeDomain(schoolId, domain) {
  const [result] = await pool.query(
    'DELETE FROM School_Domains WHERE school_id = ? AND domain = ?',
    [schoolId, domain]
  );
  return result.affectedRows > 0;
}
