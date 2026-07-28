import { pool } from '../config/db.js';

export async function findAllDorms({ schoolId }) {
  let sql = `
    SELECT
      d.*,
      s.name AS school_name,
      ROUND(AVG(dr.overall_rating), 2) AS avg_rating,
      COUNT(DISTINCT dr.dorm_review_id) AS review_count
    FROM Dorms d
    JOIN Schools s ON s.school_id = d.school_id
    LEFT JOIN Rooms r ON r.dorm_id = d.dorm_id
    LEFT JOIN Dorm_Review dr ON dr.room_id = r.room_id
  `;
  const params = [];

  if (schoolId) {
    sql += ' WHERE d.school_id = ?';
    params.push(schoolId);
  }

  sql += ' GROUP BY d.dorm_id ORDER BY d.name';
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function findDormById(dormId) {
  const [rows] = await pool.query('SELECT * FROM Dorms WHERE dorm_id = ?', [dormId]);
  return rows[0] || null;
}

// Includes average rating per dorm, computed across all rooms' reviews.
// LEFT JOIN so dorms with zero reviews still show up (with NULL avg).
export async function findDormWithStats(dormId) {
  const [rows] = await pool.query(
    `SELECT
       d.*,
       s.name AS school_name,
       ROUND(AVG(dr.overall_rating), 2) AS avg_rating,
       COUNT(dr.dorm_review_id) AS review_count
     FROM Dorms d
     JOIN Schools s ON s.school_id = d.school_id
     LEFT JOIN Rooms r ON r.dorm_id = d.dorm_id
     LEFT JOIN Dorm_Review dr ON dr.room_id = r.room_id
     WHERE d.dorm_id = ?
     GROUP BY d.dorm_id`,
    [dormId]
  );
  return rows[0] || null;
}

export async function createDorm({ schoolId, name, address }) {
  const [result] = await pool.query(
    'INSERT INTO Dorms (school_id, name, address) VALUES (?, ?, ?)',
    [schoolId, name, address]
  );
  return findDormById(result.insertId);
}

// Admin edit — only updates the fields actually provided, so a
// partial PATCH (e.g. just fixing a typo'd address) doesn't clobber
// the rest of the row with undefined.
export async function updateDorm(dormId, { schoolId, name, address }) {
  const fields = [];
  const params = [];
  if (schoolId !== undefined) { fields.push('school_id = ?'); params.push(schoolId); }
  if (name !== undefined) { fields.push('name = ?'); params.push(name); }
  if (address !== undefined) { fields.push('address = ?'); params.push(address); }
  if (fields.length === 0) return findDormById(dormId);

  params.push(dormId);
  await pool.query(`UPDATE Dorms SET ${fields.join(', ')} WHERE dorm_id = ?`, params);
  return findDormById(dormId);
}

export async function deleteDorm(dormId) {
  const [result] = await pool.query('DELETE FROM Dorms WHERE dorm_id = ?', [dormId]);
  return result.affectedRows > 0;
}

// Sets/replaces a dorm's photo. Any authenticated user can currently
// contribute a photo (see dorms.controller.js) — there's no per-dorm
// ownership concept in this schema, unlike listings which have no
// owner either. Overwrites rather than appending; a gallery of
// multiple photos would need a separate Dorm_Photo table.
export async function setDormImage(dormId, imageUrl) {
  await pool.query('UPDATE Dorms SET image_url = ? WHERE dorm_id = ?', [imageUrl, dormId]);
  return findDormById(dormId);
}
