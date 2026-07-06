import { pool } from '../config/db.js';

export async function findRoomsByDorm(dormId) {
  const [rows] = await pool.query(
    `SELECT r.*,
       ROUND(AVG(dr.overall_rating), 2) AS avg_rating,
       COUNT(dr.dorm_review_id) AS review_count
     FROM Rooms r
     LEFT JOIN Dorm_Review dr ON dr.room_id = r.room_id
     WHERE r.dorm_id = ? AND NOT (r.room_number = 'General' AND r.floor IS NULL)
     GROUP BY r.room_id
     ORDER BY r.floor, r.room_number`,
    [dormId]
  );
  return rows;
}

export async function findRoomById(roomId) {
  const [rows] = await pool.query('SELECT * FROM Rooms WHERE room_id = ?', [roomId]);
  return rows[0] || null;
}

export async function createRoom({ dormId, floor, roomNumber }) {
  const [result] = await pool.query(
    'INSERT INTO Rooms (dorm_id, floor, room_number) VALUES (?, ?, ?)',
    [dormId, floor, roomNumber]
  );
  return findRoomById(result.insertId);
}

// Used when a reviewer doesn't know their specific room number — finds
// or creates a shared "General" placeholder room for this dorm.
// Deliberately scoped to room_number = 'General' specifically, NOT just
// "the dorm's first room" — otherwise a generic review could silently
// attach to someone's real, numbered room.
export async function findOrCreateDefaultRoom(dormId) {
  const [rows] = await pool.query(
    "SELECT * FROM Rooms WHERE dorm_id = ? AND room_number = 'General' AND floor IS NULL LIMIT 1",
    [dormId]
  );
  if (rows[0]) return rows[0];
  return createRoom({ dormId, floor: null, roomNumber: 'General' });
}
