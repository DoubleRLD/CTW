import { pool } from '../config/db.js';

export async function findReviewsByRoom(roomId) {
  const [rows] = await pool.query(
    `SELECT dr.*, u.name AS reviewer_name
     FROM Dorm_Review dr
     JOIN Users u ON u.user_id = dr.user_id
     WHERE dr.room_id = ?
     ORDER BY dr.created_at DESC`,
    [roomId]
  );
  return rows;
}

// Also useful for a dorm-level view (all rooms' reviews combined),
// since the frontend shows reviews per-dorm, not per-room.
export async function findReviewsByDorm(dormId) {
  const [rows] = await pool.query(
    `SELECT dr.*, u.name AS reviewer_name, r.room_number
     FROM Dorm_Review dr
     JOIN Users u ON u.user_id = dr.user_id
     JOIN Rooms r ON r.room_id = dr.room_id
     WHERE r.dorm_id = ?
     ORDER BY dr.created_at DESC`,
    [dormId]
  );
  return rows;
}

export async function findReviewById(reviewId) {
  const [rows] = await pool.query('SELECT * FROM Dorm_Review WHERE dorm_review_id = ?', [reviewId]);
  return rows[0] || null;
}

export async function createReview({
  roomId,
  userId,
  semester,
  semesterYear,
  cleanlinessRating,
  noiseRating,
  locationRating,
  overallRating,
  body,
}) {
  const [result] = await pool.query(
    `INSERT INTO Dorm_Review
       (room_id, user_id, semester, semester_year, cleanliness_rating, noise_rating, location_rating, overall_rating, body)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [roomId, userId, semester, semesterYear, cleanlinessRating, noiseRating, locationRating, overallRating, body ?? null]
  );
  return findReviewById(result.insertId);
}

export async function deleteReview(reviewId, userId) {
  // Scoped to userId so a user can only delete their own review —
  // the route/controller also checks this, but enforcing it in the
  // query itself means a bug upstream can't silently let someone
  // delete someone else's review.
  const [result] = await pool.query(
    'DELETE FROM Dorm_Review WHERE dorm_review_id = ? AND user_id = ?',
    [reviewId, userId]
  );
  return result.affectedRows > 0;
}
