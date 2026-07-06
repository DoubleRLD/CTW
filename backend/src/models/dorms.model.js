import { pool } from '../config/db.js';

export async function findAllDorms({ schoolId }) {
  let sql = `
    SELECT d.*, s.name AS school_name
    FROM Dorms d
    JOIN Schools s ON s.school_id = d.school_id
  `;
  const params = [];

  if (schoolId) {
    sql += ' WHERE d.school_id = ?';
    params.push(schoolId);
  }

  sql += ' ORDER BY d.name';
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
